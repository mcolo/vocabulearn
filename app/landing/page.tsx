import styles from './landing.module.css';
import SiteLogo from "@/components/ui/site-header/site-logo";
import * as words from './words.json';
import Words from './words';

export default function LandingPage() {

  return (
    <>
      <section className={styles.hero}>
        <Words words={words.results} />
        <header className={styles.header}><SiteLogo className={styles.logo}/></header>
        <h1 className={styles.headline}>Expand your vocabulary with spaced repition</h1>
      </section>
      <main className={styles.content}>
          <p className="pt-8 pb-[1000px]">some more content goes here</p>
      </main>
    </>
  )
}