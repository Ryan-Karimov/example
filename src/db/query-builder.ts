export class QueryBuilder {
    /**
     * Генерация SELECT-запроса с фильтрами
     * @param table - имя таблицы
     * @param filters - условия фильтрации (ключи - столбцы, значения - фильтры)
     * @returns { query: string; params: any[] }
     */
    static buildSelect(table: string, filters: Record<string, any>): { query: string; params: any[] } {
        const keys = Object.keys(filters);
        const whereClause = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
        const params = keys.map((key) => filters[key]);

        const query = `SELECT * FROM ${table}${whereClause ? ' WHERE ' + whereClause : ''}`;
        return { query, params };
    }

    /**
     * Генерация INSERT-запроса
     * @param table - имя таблицы
     * @param data - объект данных для вставки
     * @returns { query: string; params: any[] }
     */
    static buildInsert(table: string, data: Record<string, any>): { query: string; params: any[] } {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

        const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        return { query, params: values };
    }

    /**
     * Генерация UPDATE-запроса
     * @param table - имя таблицы
     * @param data - объект данных для обновления
     * @param filters - объект условий
     * @returns { query: string; params: any[] }
     */
    static buildUpdate(
        table: string,
        data: Record<string, any>,
        filters: Record<string, any>
    ): { query: string; params: any[] } {
        const dataKeys = Object.keys(data);
        const filterKeys = Object.keys(filters);

        const setClause = dataKeys.map((key, index) => `${key} = $${index + 1}`).join(', ');
        const whereClause = filterKeys
            .map((key, index) => `${key} = $${index + dataKeys.length + 1}`)
            .join(' AND ');

        const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause} RETURNING *`;
        const params = [...Object.values(data), ...Object.values(filters)];

        return { query, params };
    }

    /**
     * Генерация DELETE-запроса
     * @param table - имя таблицы
     * @param filters - объект условий
     * @returns { query: string; params: any[] }
     */
    static buildDelete(table: string, filters: Record<string, any>): { query: string; params: any[] } {
        const keys = Object.keys(filters);
        const whereClause = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
        const params = keys.map((key) => filters[key]);

        const query = `DELETE FROM ${table}${whereClause ? ' WHERE ' + whereClause : ''} RETURNING *`;
        return { query, params };
    }

    static buildInsertMany(table: string, dataArray: Record<string, any>[]): { query: string; params: any[] } {
        if (dataArray.length === 0) {
            throw new Error('No data provided for bulk insert');
        }

        const columns = Object.keys(dataArray[0]);
        const values: string[] = [];
        const params: any[] = [];

        dataArray.forEach((data, index) => {
            const placeholders = columns.map((_, colIndex) => `$${index * columns.length + colIndex + 1}`);
            values.push(`(${placeholders.join(', ')})`);
            params.push(...Object.values(data));
        });

        const query = `
        INSERT INTO ${table} (${columns.join(', ')})
        VALUES ${values.join(', ')}
        RETURNING *;
    `;

        return { query, params };
    }

}
