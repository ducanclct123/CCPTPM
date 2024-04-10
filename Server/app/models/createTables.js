// createTables.js

const db = require("../config/db");

const createTables = async () => {
    try {
        // Tạo bảng "users" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(255),
                username VARCHAR(255),
                password VARCHAR(255) NOT NULL,
                role VARCHAR(255),
                status VARCHAR(255) DEFAULT 'noactive',
                image VARCHAR(255) DEFAULT 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log('Table "users" created or already exists.');

        // Thêm bảng "asset_categories"
        await db.execute(`
         CREATE TABLE IF NOT EXISTS asset_categories (
             id INT AUTO_INCREMENT PRIMARY KEY,
             name VARCHAR(255) NOT NULL,
             description TEXT,
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         )
     `);

        console.log('Table "asset_categories" created or already exists.');

        // Tạo bảng "password_reset_tokens" nếu chưa tồn tại
        await db.execute(`
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            token VARCHAR(255) NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
        `);

        console.log('Table "password_reset_tokens" created or already exists.');

        // Tạo bảng "assets " nếu chưa tồn tại
        await db.execute(`
          CREATE TABLE IF NOT EXISTS assets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            value DECIMAL(10, 2), 
            location VARCHAR(255),
            status VARCHAR(255),
            quantity INT,
            category_id INT,
            image VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES asset_categories(id) ON DELETE CASCADE
        )
          `);

        console.log('Table "assets" created or already exists.');

        // Thực hiện truy vấn kiểm tra xem cột "approval" đã tồn tại trong bảng "assets" hay chưa
        const [rows, fields] = await db.execute(`
            SHOW COLUMNS FROM assets LIKE 'approval'
        `);

        // Kiểm tra xem cột "approval" đã tồn tại chưa
        const columnExists = rows.length > 0;

        // Nếu cột chưa tồn tại, thêm cột "approval"
        if (!columnExists) {
            await db.execute(`
                ALTER TABLE assets
                ADD COLUMN approval VARCHAR(255) DEFAULT 'unapproved'
            `);

            console.log(
                'Column "approval" added to table "assets" with default value "unapproved".',
            );
        } else {
            console.log('Column "approval" already exists in table "assets".');
        }

        // Thực hiện truy vấn ALTER TABLE để thêm cột createdBy vào bảng assets và thiết lập khóa ngoại tới bảng users
        //      await db.execute(`
        //      ALTER TABLE assets
        //      ADD COLUMN createdBy INT,
        //      ADD CONSTRAINT FK_createdBy
        //      FOREIGN KEY (createdBy)
        //      REFERENCES users(id)
        //  `);

        //      await db.execute(`
        //      ALTER TABLE asset_user
        //      ADD COLUMN submission_file VARCHAR(255) DEFAULT NULL,
        //      ADD COLUMN submission_status VARCHAR(50) DEFAULT NULL;

        //  `);

        //      await db.execute(`
        //      ALTER TABLE asset_user
        //      ADD COLUMN submission_comment TEXT DEFAULT NULL;

        //  `);

        // Tạo bảng "personal_info " nếu chưa tồn tại
        await db.execute(`
        CREATE TABLE IF NOT EXISTS personal_info (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            full_name VARCHAR(255),
            address TEXT,
            phone_number VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
        `);

        console.log('Table "personal_info" created or already exists.');

        // Tạo bảng "notifications" nếu chưa tồn tại
        await db.execute(`
         CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
       `);

        console.log('Table "notifications" created or already exists.');

        // Tạo bảng "residence_rules" nếu chưa tồn tại
        await db.execute(`
        CREATE TABLE IF NOT EXISTS residence_rules (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);

        console.log('Table "residence_rules" created or already exists.');

        // Tạo bảng "contracts" nếu chưa tồn tại
        await db.execute(`
        CREATE TABLE IF NOT EXISTS contracts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vendor_id INT,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            start_date DATE,
            end_date DATE,
            value DECIMAL(10, 2),
            status VARCHAR(255) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (vendor_id) REFERENCES vendors(id)
        )
        `);

        console.log('Table "contracts" created or already exists.');

        // Tạo bảng "news" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS news (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                image VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log('Table "news" created or already exists.');

        // Tạo bảng "asset_user " nếu chưa tồn tại
        await db.execute(`
         CREATE TABLE IF NOT EXISTS asset_user (
            id INT AUTO_INCREMENT PRIMARY KEY,
            asset_id INT,
            user_id INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
     `);

        console.log('Table "asset_user" created or already exists.');
    } catch (error) {
        console.error("Error creating tables:", error);
    } finally {
    }
};

createTables();
