import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { UserProfile, GeneratedPlan, User } from './types';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Tentar recuperar sessão ao iniciar (opcional, aqui forçamos login por segurança visual)
  useEffect(() => {
    setIsInitializing(false);
  }, []);

  // Carregar dados quando o usuário muda (loga)
  useEffect(() => {
    if (user) {
      // Usamos user.email como chave única
      const storedProfile = authService.getUserData(user.email, 'profile');
      const storedPlan = authService.getUserData(user.email, 'plan');

      if (storedProfile && storedPlan) {
        setProfile(JSON.parse(storedProfile));
        setPlan(JSON.parse(storedPlan));
      } else {
        setProfile(null);
        setPlan(null);
      }
    }
  }, [user]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleOnboardingComplete = (newProfile: UserProfile, newPlan: GeneratedPlan) => {
    if (!user) return;
    
    setProfile(newProfile);
    setPlan(newPlan);
    
    authService.saveUserData(user.email, 'profile', newProfile);
    authService.saveUserData(user.email, 'plan', newPlan);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    if (!user) return;
    
    setProfile(updatedProfile);
    authService.saveUserData(user.email, 'profile', updatedProfile);
    
    // Nota: Se a mudança de meta exigir um novo plano, poderiamos regerar aqui.
    // Por enquanto, apenas salvamos as metas.
  };

  const handleReset = () => {
    // Logout
    setUser(null);
    setProfile(null);
    setPlan(null);
  };

  if (isInitializing) {
    return <div className="min-h-screen bg-secondary flex items-center justify-center text-primary">Carregando...</div>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (!profile || !plan) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <Dashboard 
        profile={{...profile, name: user.name}} 
        plan={plan} 
        onReset={handleReset} 
        onUpdateProfile={handleUpdateProfile}
    />
  );
};

export default App;