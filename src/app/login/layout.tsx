import { Metadata } from "next";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Login Linh Lang",
  description: "Linh Lang Company",
};
export default function Layout({ children }: any) {
    return (
      <>
        <main>{children}</main>
      </>
    );
  }