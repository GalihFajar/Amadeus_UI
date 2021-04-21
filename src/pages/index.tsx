import Head from "next/head";
import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{" "}
          <a className="text-blue-600" href="https://nextjs.org">
            Amadeus!
          </a>
        </h1>

        <p className="mt-3 text-2xl">
          Get Started by clicking the button below 😎
        </p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <a
            href="/visual/1234"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Try Me &rarr;</h3>
            <p className="mt-4 text-xl">Try the system!</p>
          </a>
        </div>
      </main>
    </div>
  );
}
