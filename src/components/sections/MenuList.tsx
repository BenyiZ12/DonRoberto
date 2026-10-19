import type { MenuCategory } from '@/data/menu';
import { formatCRC } from '@/lib/format';
import styles from './MenuList.module.css';

export interface MenuListProps {
  categories: MenuCategory[];
}

/** Lista del menú por categorías. Los platos sin precio confirmado muestran «Consultar». */
export function MenuList({ categories }: MenuListProps) {
  return (
    <div className={styles.menu}>
      {categories.map((category) => (
        <section key={category.id} className={styles.category} aria-labelledby={`categoria-${category.id}`}>
          <header className={styles.categoryHeader}>
            <h3 className={styles.categoryTitle} id={`categoria-${category.id}`}>
              {category.title}
            </h3>
            {category.description ? (
              <p className={styles.categoryDescription}>{category.description}</p>
            ) : null}
          </header>

          <ul className={styles.items}>
            {category.items.map((item) => (
              <li key={item.id} className={styles.item} data-available={item.available ? 'true' : 'false'}>
                <div className={styles.itemMain}>
                  <p className={styles.itemName}>
                    {item.name}
                    {item.available ? null : <span className={styles.soldOut}>Agotado</span>}
                  </p>
                  {item.description ? (
                    <p className={styles.itemDescription}>{item.description}</p>
                  ) : null}
                  {item.note ? <p className={styles.itemNote}>{item.note}</p> : null}
                  {item.tags.length > 0 ? (
                    <ul className={styles.tags}>
                      {item.tags.map((tag) => (
                        <li key={tag} className={styles.tag}>
                          {tag}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <p className={styles.itemPrice}>
                  {item.price !== null ? formatCRC(item.price) : 'Consultar'}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
