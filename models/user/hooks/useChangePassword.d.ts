export default useChangePassword;
declare function useChangePassword(): {
    isLoading: boolean | undefined;
    isSuccess: boolean | undefined;
    isLoggedIn: boolean;
    error: Error | null | undefined;
    authenticationErrorMessage: unknown;
    changePassword: (userId: any, currentPassword: any, newPassword: any) => any;
};
