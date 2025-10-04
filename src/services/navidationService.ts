// src/services/navigationService.ts
class NavigationService {
  private static instance: NavigationService;
  private navigateFunction: ((path: string) => void) | null = null;

  private constructor() {}

  static getInstance(): NavigationService {
    if (!NavigationService.instance) {
      NavigationService.instance = new NavigationService();
    }
    return NavigationService.instance;
  }

  setNavigateFunction(navigate: (path: string) => void) {
    this.navigateFunction = navigate;
  }

  navigateTo(path: string) {
    if (this.navigateFunction) {
      this.navigateFunction(path);
    } else {
      window.location.href = path;
    }
  }

  navigateToVeg() {
    this.navigateTo('/veg');
  }

  navigateToHome() {
    this.navigateTo('/');
  }
}

export const navigationService = NavigationService.getInstance();