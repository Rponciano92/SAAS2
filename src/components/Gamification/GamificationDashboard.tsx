import React from 'react';
import { Trophy, Star, Target, Award, Zap, TrendingUp, Users, Calendar, BarChart3, FileText, Brain, CheckCircle } from 'lucide-react';
import { MOCK_USER_GAMIFICATION, LEVELS, BADGES, WEEKLY_CHALLENGES, REWARDS } from '@/data/gamificationData';
import { Badge as BadgeType, Level, Challenge, Reward } from '@/types/gamification';

export default function GamificationDashboard() {
  const userGamification = MOCK_USER_GAMIFICATION;
  const currentLevel = LEVELS.find(level => level.level === userGamification.currentLevel);
  const nextLevel = LEVELS.find(level => level.level === userGamification.currentLevel + 1);
  
  // Calculate progress to next level
  const currentLevelPoints = currentLevel ? currentLevel.pointsRequired : 0;
  const nextLevelPoints = nextLevel ? nextLevel.pointsRequired : Infinity;
  const pointsToNextLevel = nextLevelPoints - currentLevelPoints;
  const userPointsInCurrentLevel = userGamification.totalPoints - currentLevelPoints;
  const progressPercentage = Math.min(Math.round((userPointsInCurrentLevel / pointsToNextLevel) * 100), 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card-strong p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-[#B8860B] to-[#DAA520] rounded-xl shadow-lg">
              <Trophy size={24} className="text-white" />
            </div>
            <div>
              <h1 className="page-title">🏆 Sistema de Gamificação</h1>
              <p className="text-gray-600">Evolua, contribua e ganhe recompensas exclusivas</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="premium-text text-2xl font-bold mb-1">
              {userGamification.totalPoints.toLocaleString()} pontos
            </div>
            <div className="text-sm text-gray-600">
              Nível {userGamification.currentLevel}: {currentLevel?.name}
            </div>
          </div>
        </div>

        {/* Nível e Progresso */}
        <div className="glass-card-subtle p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: currentLevel?.color }}
              >
                {userGamification.currentLevel}
              </div>
              <div>
                <p className="font-bold text-[#003B6D]">{currentLevel?.name}</p>
                <p className="text-xs text-gray-600">
                  {nextLevel ? `${userPointsInCurrentLevel.toLocaleString()} / ${pointsToNextLevel.toLocaleString()} pontos para o próximo nível` : 'Nível máximo alcançado!'}
                </p>
              </div>
            </div>
            {nextLevel && (
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold opacity-70"
                  style={{ backgroundColor: nextLevel.color }}
                >
                  {nextLevel.level}
                </div>
                <p className="text-sm font-medium">{nextLevel.name}</p>
              </div>
            )}
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2.5 mb-1">
            <div 
              className="bg-gradient-to-r from-[#B8860B] to-[#DAA520] h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-600">
            <span>{currentLevel?.name}</span>
            <span>{progressPercentage}%</span>
            <span>{nextLevel?.name || 'Nível Máximo'}</span>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card-subtle p-3 text-center">
            <div className="text-xl font-bold text-[#B8860B] mb-1">{userGamification.ranking.monthly}</div>
            <div className="text-xs text-gray-600">Ranking Mensal</div>
          </div>
          <div className="glass-card-subtle p-3 text-center">
            <div className="text-xl font-bold text-[#0A74DA] mb-1">{userGamification.streaks.daily}</div>
            <div className="text-xs text-gray-600">Dias Consecutivos</div>
          </div>
          <div className="glass-card-subtle p-3 text-center">
            <div className="text-xl font-bold text-[#28A745] mb-1">{userGamification.stats.contributionsApproved}</div>
            <div className="text-xs text-gray-600">Contribuições</div>
          </div>
          <div className="glass-card-subtle p-3 text-center">
            <div className="text-xl font-bold text-[#FFA500] mb-1">{userGamification.badges.length}</div>
            <div className="text-xs text-gray-600">Badges</div>
          </div>
        </div>
      </div>

      {/* Layout Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda - Desafios */}
        <div className="lg:col-span-2 space-y-6">
          {/* Desafios Semanais */}
          <div className="glass-card p-6">
            <h3 className="section-title flex items-center space-x-3 mb-6">
              <Target className="text-[#FFA500]" size={24} />
              <span>🎯 Desafios Semanais</span>
            </h3>
            
            <div className="space-y-4">
              {WEEKLY_CHALLENGES.map(challenge => {
                const progress = challenge.progress || 0;
                const progressPercentage = Math.round((progress / challenge.maxProgress) * 100);
                
                return (
                  <div key={challenge.id} className="glass-card-subtle p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-[#003B6D]">{challenge.name}</h4>
                        <p className="text-sm text-gray-600">{challenge.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-[#FFA500]">
                          {challenge.reward.points} pontos
                        </div>
                        {challenge.reward.badge && (
                          <div className="text-xs text-gray-600">
                            + Badge: {BADGES.find(b => b.id === challenge.reward.badge)?.name}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-sm font-medium text-[#003B6D] mb-1">
                        {challenge.objective}
                      </p>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[#FFA500] to-[#FF8C00] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>Progresso: {progress}/{challenge.maxProgress}</span>
                        <span>{progressPercentage}%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button className="px-4 py-2 bg-white/10 text-[#003B6D] rounded-lg hover:bg-white/20 transition-colors text-sm">
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Meta Mensal */}
          {userGamification.monthlyGoal && (
            <div className="glass-card p-6 border-[#B8860B]/30 bg-[#B8860B]/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="section-title flex items-center space-x-3">
                  <Award className="text-[#B8860B]" size={24} />
                  <span>🏆 Meta Mensal - Janeiro 2025</span>
                </h3>
                
                <div className="text-right">
                  <div className="text-sm font-medium text-[#B8860B]">
                    {userGamification.monthlyGoal.status === 'completed' ? 'Concluída!' : 
                     userGamification.monthlyGoal.status === 'claimed' ? 'Recompensa Resgatada!' : 
                     'Em Progresso'}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-[#003B6D]">Critérios</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-gray-700">Pontos Mensais</p>
                        <p className="text-sm font-medium">
                          <span className={userGamification.monthlyGoal.progress.currentPoints >= userGamification.monthlyGoal.criteria.minPoints ? 'text-[#28A745]' : 'text-gray-700'}>
                            {userGamification.monthlyGoal.progress.currentPoints}
                          </span>
                          /{userGamification.monthlyGoal.criteria.minPoints}
                        </p>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-[#B8860B] to-[#DAA520] h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, (userGamification.monthlyGoal.progress.currentPoints / userGamification.monthlyGoal.criteria.minPoints) * 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-gray-700">Contribuições Validadas</p>
                        <p className="text-sm font-medium">
                          <span className={userGamification.monthlyGoal.progress.validatedContributions >= userGamification.monthlyGoal.criteria.validatedContributions ? 'text-[#28A745]' : 'text-gray-700'}>
                            {userGamification.monthlyGoal.progress.validatedContributions}
                          </span>
                          /{userGamification.monthlyGoal.criteria.validatedContributions}
                        </p>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-[#B8860B] to-[#DAA520] h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, (userGamification.monthlyGoal.progress.validatedContributions / userGamification.monthlyGoal.criteria.validatedContributions) * 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-gray-700">Empresas Ativas</p>
                        <p className="text-sm font-medium">
                          <span className={userGamification.monthlyGoal.progress.activeCompanies >= userGamification.monthlyGoal.criteria.activeCompanies ? 'text-[#28A745]' : 'text-gray-700'}>
                            {userGamification.monthlyGoal.progress.activeCompanies}
                          </span>
                          /{userGamification.monthlyGoal.criteria.activeCompanies}
                        </p>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-[#B8860B] to-[#DAA520] h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, (userGamification.monthlyGoal.progress.activeCompanies / userGamification.monthlyGoal.criteria.activeCompanies) * 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-gray-700">Dias Ativos</p>
                        <p className="text-sm font-medium">
                          <span className={userGamification.monthlyGoal.progress.activeDays >= userGamification.monthlyGoal.criteria.activeDays ? 'text-[#28A745]' : 'text-gray-700'}>
                            {userGamification.monthlyGoal.progress.activeDays}
                          </span>
                          /{userGamification.monthlyGoal.criteria.activeDays}
                        </p>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-[#B8860B] to-[#DAA520] h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, (userGamification.monthlyGoal.progress.activeDays / userGamification.monthlyGoal.criteria.activeDays) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card-subtle p-4 border-[#B8860B]/30 bg-[#B8860B]/5">
                  <h4 className="font-semibold text-[#003B6D] mb-3">Recompensa</h4>
                  
                  <div className="text-center mb-4">
                    <p className="text-lg font-bold text-[#B8860B] mb-1">
                      {userGamification.monthlyGoal.reward.name}
                    </p>
                    <p className="text-xs text-gray-600 mb-2">
                      {userGamification.monthlyGoal.reward.value}
                    </p>
                    <p className="text-sm font-bold text-[#B8860B] bg-[#B8860B]/10 py-1 px-3 rounded-full inline-block">
                      {userGamification.monthlyGoal.reward.duration}
                    </p>
                  </div>
                  
                  <button 
                    className={`w-full py-3 rounded-lg font-medium transition-all ${
                      userGamification.monthlyGoal.status === 'completed' 
                        ? 'bg-gradient-to-r from-[#B8860B] to-[#DAA520] text-white hover:shadow-lg' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={userGamification.monthlyGoal.status !== 'completed'}
                  >
                    {userGamification.monthlyGoal.status === 'claimed' 
                      ? 'Recompensa Resgatada' 
                      : userGamification.monthlyGoal.status === 'completed'
                        ? 'Resgatar Recompensa'
                        : 'Complete a Meta para Resgatar'}
                  </button>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Progresso Geral</p>
                <div className="w-full bg-white/20 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-gradient-to-r from-[#B8860B] to-[#DAA520] h-2.5 rounded-full"
                    style={{ width: '62%' }}
                  />
                </div>
                <p className="text-sm font-medium text-[#B8860B]">62% Completo</p>
              </div>
            </div>
          )}
        </div>

        {/* Coluna Direita - Badges e Ranking */}
        <div className="space-y-6">
          {/* Badges */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#003B6D] flex items-center space-x-2">
                <Star className="text-[#FFA500]" size={20} />
                <span>🏅 Badges Conquistados</span>
              </h3>
              <button className="text-sm text-[#0A74DA] hover:underline">
                Ver Todos
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {userGamification.badges.map((badge, index) => (
                <div key={index} className="glass-card-subtle p-3 text-center">
                  <div className="text-2xl mb-2">{badge.icon}</div>
                  <p className="font-medium text-[#003B6D] text-sm">{badge.name}</p>
                  <p className="text-xs text-gray-600">{badge.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 glass-card-subtle">
              <h4 className="font-medium text-[#003B6D] text-sm mb-2">Próximos Badges</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg opacity-50">🏆</span>
                    <span className="text-sm text-gray-600">Mentor Supremo</span>
                  </div>
                  <div className="text-xs text-gray-500">3/50</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg opacity-50">📚</span>
                    <span className="text-sm text-gray-600">Biblioteca Viva</span>
                  </div>
                  <div className="text-xs text-gray-500">2/25</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Ranking */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-[#003B6D] flex items-center space-x-2 mb-4">
              <TrendingUp className="text-[#0A74DA]" size={20} />
              <span>🏆 Ranking Mensal</span>
            </h3>
            
            <div className="space-y-3">
              {[
                { position: 1, name: 'Ana Costa', avatar: '👩‍💼', points: 12450, isCurrentUser: false },
                { position: 2, name: 'João Silva', avatar: '👨‍💼', points: 11200, isCurrentUser: false },
                { position: 3, name: 'Carlos Silva', avatar: '👨‍💻', points: 8450, isCurrentUser: true },
                { position: 4, name: 'Mariana Oliveira', avatar: '👩‍💻', points: 7800, isCurrentUser: false },
                { position: 5, name: 'Pedro Santos', avatar: '👨‍🚀', points: 6500, isCurrentUser: false }
              ].map((user, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    user.isCurrentUser ? 'bg-[#0A74DA]/10 border border-[#0A74DA]/30' : 'glass-card-subtle'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      user.position === 1 ? 'bg-[#FFD700] text-[#003B6D]' :
                      user.position === 2 ? 'bg-[#C0C0C0] text-[#003B6D]' :
                      user.position === 3 ? 'bg-[#CD7F32] text-[#003B6D]' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {user.position}
                    </div>
                    <div className="text-xl">{user.avatar}</div>
                    <div className="text-sm font-medium text-[#003B6D]">
                      {user.name} {user.isCurrentUser && '(Você)'}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-[#B8860B]">
                    {user.points.toLocaleString()} pts
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recompensas */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-[#003B6D] flex items-center space-x-2 mb-4">
              <Award className="text-[#FFA500]" size={20} />
              <span>🎁 Recompensas Disponíveis</span>
            </h3>
            
            <div className="space-y-3">
              {REWARDS.slice(0, 3).map((reward, index) => (
                <div key={index} className="glass-card-subtle p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-[#003B6D] text-sm">{reward.name}</h4>
                    <span className="text-xs font-medium text-[#B8860B]">
                      {reward.pointsCost ? `${reward.pointsCost} pontos` : `${reward.requirementValue} ${reward.requirementType}`}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{reward.description}</p>
                  <button className="w-full py-1.5 text-xs bg-white/10 text-[#003B6D] rounded-lg hover:bg-white/20 transition-colors">
                    Ver Detalhes
                  </button>
                </div>
              ))}
              
              <button className="w-full py-2 text-sm text-[#0A74DA] hover:underline">
                Ver Todas as Recompensas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}