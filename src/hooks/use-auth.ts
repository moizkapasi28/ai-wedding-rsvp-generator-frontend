import type { User } from "@/models/user.model";
import { isLoggedInAtom, userAtom, refreshTokenAtom } from "@/store/store";
import { useAtom } from "jotai";

export const useAuth = () => {
  const [user, setUser] = useAtom(userAtom);
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [refreshToken, setRefreshToken] = useAtom(refreshTokenAtom);

  const login = (userData: User, refreshToken: string | null = null) => {
    console.log(userData, refreshToken);

    setUser(userData);
    setIsLoggedIn(true);
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return { user, isLoggedIn, login, logout, refreshToken };
};
