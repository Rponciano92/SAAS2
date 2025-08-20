/**
 * Fireflies Storage Service
 * Gerencia upload e armazenamento de arquivos para Fireflies
 */

import { supabase } from '../../lib/supabase';
import { firefliesConfig } from './firefliesConfig.js';

class FirefliesStorageService {
  constructor() {
    this.config = firefliesConfig;
    this.bucketName = 'fireflies-uploads';
    this.supabase = supabase;
  }

  /**
   * Faz upload de arquivo para Supabase Storage
   * @param {File} file - Arquivo para upload
   * @param {Object} options - Opções de upload
   * @returns {Promise<string>} URL pública do arquivo
   */
  async uploadFile(file, options = {}) {
    try {
      // Validações
      this.validateFile(file);
      
      const {
        folder = 'meetings',
        generateUniqueName = true,
        cacheControl = '3600'
      } = options;

      // Gerar nome único do arquivo
      const fileName = generateUniqueName 
        ? this.generateUniqueFileName(file.name)
        : file.name;
      
      const filePath = `${folder}/${fileName}`;

      // Upload para Supabase Storage
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(filePath, file, {
          cacheControl,
          upsert: false,
          contentType: file.type
        });

      if (error) {
        throw new Error(`Erro no upload para Supabase Storage: ${error.message}`);
      }

      // Obter URL pública
      const publicUrl = await this.getPublicUrl(filePath);
      
      // Log do upload bem-sucedido
      console.log('✅ Upload realizado com sucesso:', {
        fileName,
        filePath,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        publicUrl
      });

      return publicUrl;
    } catch (error) {
      console.error('❌ Erro no upload:', error);
      throw error;
    }
  }

  /**
   * Obtém URL pública do arquivo
   * @param {string} filePath - Caminho do arquivo
   * @returns {Promise<string>} URL pública
   */
  async getPublicUrl(filePath) {
    try {
      const { data } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      if (!data || !data.publicUrl) {
        throw new Error('Não foi possível obter URL pública do arquivo');
      }

      return data.publicUrl;
    } catch (error) {
      console.error('Erro ao obter URL pública:', error);
      throw new Error(`Falha ao obter URL pública: ${error.message}`);
    }
  }

  /**
   * Lista arquivos no storage
   * @param {string} folder - Pasta para listar
   * @param {Object} options - Opções de listagem
   * @returns {Promise<Array>} Lista de arquivos
   */
  async listFiles(folder = 'meetings', options = {}) {
    try {
      const {
        limit = 100,
        offset = 0,
        sortBy = { column: 'created_at', order: 'desc' }
      } = options;

      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .list(folder, {
          limit,
          offset,
          sortBy
        });

      if (error) {
        throw new Error(`Erro ao listar arquivos: ${error.message}`);
      }

      return data.map(file => ({
        name: file.name,
        size: file.metadata?.size || 0,
        lastModified: file.updated_at,
        contentType: file.metadata?.mimetype,
        publicUrl: this.getPublicUrl(`${folder}/${file.name}`)
      }));
    } catch (error) {
      console.error('Erro ao listar arquivos:', error);
      throw error;
    }
  }

  /**
   * Remove arquivo do storage
   * @param {string} filePath - Caminho do arquivo
   * @returns {Promise<boolean>} Sucesso da operação
   */
  async deleteFile(filePath) {
    try {
      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        throw new Error(`Erro ao deletar arquivo: ${error.message}`);
      }

      console.log('🗑️ Arquivo deletado com sucesso:', filePath);
      return true;
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      throw error;
    }
  }

  /**
   * Obtém informações do arquivo
   * @param {string} filePath - Caminho do arquivo
   * @returns {Promise<Object>} Informações do arquivo
   */
  async getFileInfo(filePath) {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .list('', {
          search: filePath
        });

      if (error) {
        throw new Error(`Erro ao obter informações do arquivo: ${error.message}`);
      }

      const file = data.find(f => f.name === filePath.split('/').pop());
      
      if (!file) {
        throw new Error('Arquivo não encontrado');
      }

      return {
        name: file.name,
        size: file.metadata?.size || 0,
        contentType: file.metadata?.mimetype,
        lastModified: file.updated_at,
        publicUrl: await this.getPublicUrl(filePath)
      };
    } catch (error) {
      console.error('Erro ao obter informações do arquivo:', error);
      throw error;
    }
  }

  /**
   * Cria bucket se não existir
   * @returns {Promise<boolean>} Sucesso da operação
   */
  async ensureBucketExists() {
    try {
      // Verificar se bucket existe
      const { data: buckets, error: listError } = await this.supabase.storage.listBuckets();
      
      if (listError) {
        console.warn('Não foi possível verificar buckets:', listError.message);
        return false;
      }

      const bucketExists = buckets.some(bucket => bucket.name === this.bucketName);
      
      if (!bucketExists) {
        console.warn(`Bucket '${this.bucketName}' não existe. Por favor, crie-o manualmente no painel do Supabase.`);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao verificar/criar bucket:', error);
      return false;
    }
  }

  /**
   * Limpa arquivos antigos
   * @param {number} daysOld - Dias para considerar arquivo antigo
   * @returns {Promise<number>} Número de arquivos removidos
   */
  async cleanupOldFiles(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const files = await this.listFiles('meetings');
      const oldFiles = files.filter(file => 
        new Date(file.lastModified) < cutoffDate
      );

      let deletedCount = 0;
      for (const file of oldFiles) {
        try {
          await this.deleteFile(`meetings/${file.name}`);
          deletedCount++;
        } catch (error) {
          console.warn(`Erro ao deletar arquivo ${file.name}:`, error.message);
        }
      }

      console.log(`🧹 Limpeza concluída: ${deletedCount} arquivos removidos`);
      return deletedCount;
    } catch (error) {
      console.error('Erro na limpeza de arquivos:', error);
      throw error;
    }
  }

  // Métodos auxiliares privados

  /**
   * Valida arquivo antes do upload
   * @private
   */
  validateFile(file) {
    if (!file) {
      throw new Error('Arquivo não fornecido');
    }

    if (!this.config.isFileSupported(file)) {
      throw new Error(`Formato de arquivo não suportado: ${file.name}`);
    }

    if (!this.config.isFileSizeValid(file)) {
      const maxSizeMB = this.config.maxFileSize / 1024 / 1024;
      throw new Error(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`);
    }
  }

  /**
   * Gera nome único para arquivo
   * @private
   */
  generateUniqueFileName(originalName) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    
    return `${timestamp}_${random}_${nameWithoutExt}.${extension}`;
  }

  /**
   * Obtém estatísticas de storage
   * @returns {Promise<Object>} Estatísticas
   */
  async getStorageStats() {
    try {
      const files = await this.listFiles('meetings');
      
      const totalFiles = files.length;
      const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
      const averageSize = totalFiles > 0 ? totalSize / totalFiles : 0;
      
      const formatsByType = files.reduce((acc, file) => {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'unknown';
        acc[ext] = (acc[ext] || 0) + 1;
        return acc;
      }, {});

      return {
        totalFiles,
        totalSize,
        totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
        averageSize,
        averageSizeMB: (averageSize / 1024 / 1024).toFixed(2),
        formatsByType,
        bucketName: this.bucketName
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas de storage:', error);
      throw error;
    }
  }
}

export const firefliesStorageService = new FirefliesStorageService();
export default FirefliesStorageService;