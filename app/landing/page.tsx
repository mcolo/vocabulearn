import styles from './landing.module.css';
import SiteLogo from "@/components/ui/site-header/site-logo";
import words from './words8plus.json';
import SeveranceWords from './severance-words';

export default function LandingPage() {

  return (
    <>
      <section className={styles.hero}>
        <SeveranceWords words={words} />
        <header className={styles.header}><SiteLogo className={styles.logo}/></header>
        <h1 className={styles.headline}>Expand your vocabulary with spaced repition</h1>
      </section>
      <main className={styles.content}>
          <div className="pb-[1000px]"></div>
      </main>
    </>
  )
}