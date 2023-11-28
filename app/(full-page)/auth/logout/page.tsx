'use client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Logout } from "../../../service/AuthService";

const LogoutPage = () => {
    const router = useRouter();
    useEffect(() => {
        Logout().then(() => {
            router.push("/auth/login");
        });
    }, [router]);
    return (
        <h6>Logout User</h6>
    );
}

export default LogoutPage;