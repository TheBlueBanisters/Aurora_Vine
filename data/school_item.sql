-- 学校表结构
CREATE TABLE IF NOT EXISTS schools (
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

-- 插入数据
INSERT INTO schools VALUES
('mit','麻省理工学院','Massachusetts Institute of Technology','MIT','美国','USA','剑桥','Cambridge',1),
('icl','伦敦帝国学院','Imperial College London','ICL','英国','UK','伦敦','London',2),
('stanford','斯坦福大学','Stanford University','Stanford','美国','USA','斯坦福','Stanford',3),
('oxford','牛津大学','University of Oxford','Oxford','英国','UK','牛津','Oxford',4),
('harvard','哈佛大学','Harvard University','Harvard','美国','USA','剑桥','Cambridge',5);
