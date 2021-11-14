import * as React from "react";
import useFetch from "use-http";

const AuthContext = React.createContext<
	| {
			login(login: string, password: string): Promise<void>;
			logout(): void;
			userProfile: AuthenticateResponse | undefined;
			accessToken: string | undefined;
			getUserProfile(): Promise<void>;
	  }
	| undefined
>(undefined);

const useAuthHook = () => {
	const [userProfile, setUserProfile] = React.useState<AuthenticateResponse | undefined>(undefined);
	const [accessToken, setAccessToken] = React.useState<string | undefined>(undefined);
	const { post, response } = useFetch("http://localhost:5000/user/sign-in");
	const { get: fetchUserProfile, response: profileResponse } = useFetch("http://localhost:5000/user/me", {
		interceptors: {
			request: async ({ options, url, path, route }) => {
				if (options) {
					const persistedAccessToken = localStorage.getItem("accessToken");
					if (persistedAccessToken !== null) {
						//@ts-ignore
						options.headers.Authorization = `Bearer ${JSON.parse(persistedAccessToken)}`;
					}
				}
				return options;
			},
		},
	});

	const login = async (login: string, password: string) => {
		const responseData = await post({ login, password });
		if (response.ok) {
			localStorage.setItem("accessToken", JSON.stringify(responseData.token));
			setAccessToken(responseData.token);
		} else {
			throw new Error("Invalid credentials.");
		}
	};

	const logout = () => {
		setUserProfile(undefined);
		setAccessToken(undefined);
		localStorage.removeItem("accessToken");
	};

	const getUserProfile = async () => {
		const userProfileResponse = await fetchUserProfile();

		if (profileResponse.ok) {
			setUserProfile(userProfileResponse);
		} else {
			throw new Error("Token expired.");
		}
	};

	React.useEffect(() => {
		const persistedAccessToken = localStorage.getItem("accessToken");
		if (persistedAccessToken !== null) {
			setAccessToken(JSON.parse(persistedAccessToken));
		}
	}, []);

	return {
		login,
		logout,
		getUserProfile,
		userProfile,
		accessToken,
	};
};

function AuthProvider({ children }: { children: any }) {
	const value = useAuthHook();

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuthContext() {
	const context = React.useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useCount must be used within a CountProvider");
	}
	return context;
}

export { AuthProvider, useAuthContext };
