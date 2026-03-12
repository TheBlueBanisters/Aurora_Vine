const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'school_item.db');
if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);

const db = new Database(dbPath);

db.exec(`
CREATE TABLE schools (
    school_id VARCHAR(50) PRIMARY KEY,
    school_name_zh VARCHAR(200),
    school_name_en VARCHAR(200),
    short_name VARCHAR(100),
    country_zh VARCHAR(100),
    country_en VARCHAR(100),
    city_zh VARCHAR(100),
    city_en VARCHAR(100),
    ranking_qs INT
);

INSERT INTO schools VALUES
('mit','麻省理工学院','Massachusetts Institute of Technology','MIT','美国','USA','剑桥','Cambridge',1),
('icl','伦敦帝国学院','Imperial College London','ICL','英国','UK','伦敦','London',2),
('stanford','斯坦福大学','Stanford University','Stanford','美国','USA','斯坦福','Stanford',3),
('oxford','牛津大学','University of Oxford','Oxford','英国','UK','牛津','Oxford',4),
('harvard','哈佛大学','Harvard University','Harvard','美国','USA','剑桥','Cambridge',5);
`);

db.close();
console.log('数据库已生成: data/school_item.db');
