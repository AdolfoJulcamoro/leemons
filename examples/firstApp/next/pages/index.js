import Head from 'next/head';
import React from 'react';
import withPersistentState from 'src/HOC/withPersistentState';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

function Home({persistentState: [state, setState]}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Persistent State</h1>
        <p>Value: {state.value}</p>
        <button onClick={() => setState({ value: state.value + 1 })}>Increment</button>
        <Link href="/index2">Go to page without persisten State</Link>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}

export default withPersistentState(Home, 'leemons', {value: 0}, {value: 'deleted'});
