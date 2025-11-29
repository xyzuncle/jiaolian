
import { Table, NavItem, ViewMode } from './types';
import { Database, LayoutTemplate, Users, GraduationCap, ClipboardList, BookOpen, Activity } from 'lucide-vue-next';

export const APP_NAME = "健身俱乐部管理系统";

export const NAV_ITEMS: NavItem[] = [
  { 
    id: ViewMode.SYSTEM_DESIGN, 
    label: '系统设计', 
    icon: LayoutTemplate 
  },
  { 
    id: ViewMode.DB_DESIGN, 
    label: '数据库设计 (ER图)', 
    icon: Database 
  },
  {
    id: 'system_functions',
    label: '系统功能演示',
    icon: Activity,
    children: [
      { id: ViewMode.MEMBER_MGT, label: '会员管理模块', icon: Users },
      { id: ViewMode.TRAINER_MGT, label: '教练管理模块', icon: GraduationCap },
      { id: ViewMode.COURSE_MGT, label: '课程管理模块', icon: BookOpen },
      { id: ViewMode.COURSE_MOD, label: '课程模块', icon: ClipboardList },
    ]
  }
];

// Mock Data for Functional Views
export const MOCK_DATA = {
  members: [
    { id: 1001, name: '张伟', gender: '男', phone: '13800138001', status: '正常', balance: '¥2500.00' },
    { id: 1002, name: '李娜', gender: '女', phone: '13912345678', status: '正常', balance: '¥1200.50' },
    { id: 1003, name: '王强', gender: '男', phone: '13700000000', status: '即将到期', balance: '¥50.00' },
    { id: 1004, name: '赵敏', gender: '女', phone: '15966668888', status: '正常', balance: '¥5000.00' },
    { id: 1005, name: '孙悟空', gender: '男', phone: '18888888888', status: '冻结', balance: '¥0.00' },
  ],
  trainers: [
    { id: 2001, name: 'Mike', specialty: '力量训练', rate: '¥300/h', students: 12 },
    { id: 2002, name: 'Lisa', specialty: '瑜伽/普拉提', rate: '¥350/h', students: 25 },
    { id: 2003, name: 'Tom', specialty: '有氧搏击', rate: '¥280/h', students: 8 },
  ],
  courses: [
    { id: 3001, name: '零基础瑜伽', trainer: 'Lisa', difficulty: '初级', room: 'A101', time: '周一 18:00' },
    { id: 3002, name: '高强度间歇(HIIT)', trainer: 'Mike', difficulty: '高级', room: 'B202', time: '周三 19:30' },
    { id: 3003, name: '动感单车', trainer: 'Tom', difficulty: '中级', room: 'C305', time: '周五 20:00' },
  ]
};

export const TABLES: Table[] = [
  {
    name: "Members (会员表)",
    description: "存储会员个人信息及会员状态。",
    columns: [
      { name: "MemberID", type: "INT", isPK: true, description: "会员ID (主键)" },
      { name: "FullName", type: "NVARCHAR(50)", nullable: false, description: "会员姓名" },
      { name: "Gender", type: "CHAR(1)", default: "'M'", description: "性别" },
      { name: "Phone", type: "VARCHAR(20)", nullable: false, description: "联系电话" },
      { name: "JoinDate", type: "DATETIME", default: "GETDATE()", description: "入会日期" },
      { name: "Balance", type: "DECIMAL(10,2)", default: "0.00", description: "账户余额" }
    ]
  },
  {
    name: "Trainers (教练表)",
    description: "健身教练/指导员信息。",
    columns: [
      { name: "TrainerID", type: "INT", isPK: true, description: "教练ID (主键)" },
      { name: "TrainerName", type: "NVARCHAR(50)", nullable: false, description: "教练姓名" },
      { name: "Specialty", type: "NVARCHAR(100)", description: "专长" },
      { name: "HourlyRate", type: "DECIMAL(10,2)", nullable: false, description: "课时费" },
      { name: "HireDate", type: "DATE", description: "入职日期" }
    ]
  },
  {
    name: "Courses (课程表)",
    description: "俱乐部提供的课程信息。",
    columns: [
      { name: "CourseID", type: "INT", isPK: true, description: "课程ID (主键)" },
      { name: "CourseName", type: "NVARCHAR(100)", nullable: false, description: "课程名称" },
      { name: "TrainerID", type: "INT", isFK: true, fkTable: "Trainers", description: "负责教练 (外键)" },
      { name: "Difficulty", type: "VARCHAR(20)", default: "'Beginner'", description: "难度级别" },
      { name: "MaxCapacity", type: "INT", default: "30", description: "最大人数限制" }
    ]
  },
  {
    name: "Equipment (器材表)",
    description: "健身器材与设备库存。",
    columns: [
      { name: "EquipID", type: "INT", isPK: true, description: "器材ID (主键)" },
      { name: "EquipName", type: "NVARCHAR(100)", nullable: false, description: "器材名称" },
      { name: "PurchaseDate", type: "DATE", description: "购买日期" },
      { name: "Status", type: "VARCHAR(20)", default: "'Active'", description: "状态" },
      { name: "Cost", type: "DECIMAL(10,2)", description: "购买成本" }
    ]
  },
  {
    name: "Enrollments (选课记录表)",
    description: "会员与课程的多对多关联表。",
    columns: [
      { name: "EnrollID", type: "INT", isPK: true, description: "记录ID (主键)" },
      { name: "MemberID", type: "INT", isFK: true, fkTable: "Members", description: "会员 (外键)" },
      { name: "CourseID", type: "INT", isFK: true, fkTable: "Courses", description: "课程 (外键)" },
      { name: "EnrollDate", type: "DATETIME", default: "GETDATE()", description: "预订时间" },
      { name: "Attendance", type: "BIT", default: "0", description: "出勤状态" }
    ]
  }
];

export const REQUIRED_QUERIES = [
  {
    id: 'q1',
    title: '1. 基础查询 (SELECT)',
    category: 'Basic',
    description: '查询所有会员的姓名和联系电话。',
    sql: "SELECT FullName, Phone FROM Members;"
  },
  {
    id: 'q2',
    title: '2. 条件查询 (WHERE)',
    category: 'Filtering',
    description: '查询所有女性会员 (Gender = \'F\')。',
    sql: "SELECT * FROM Members WHERE Gender = 'F';"
  },
  {
    id: 'q3',
    title: '3. 范围与逻辑运算 (AND/OR)',
    category: 'Logic',
    description: '查询余额在 100 到 500 之间的会员。',
    sql: "SELECT FullName, Balance FROM Members WHERE Balance >= 100 AND Balance <= 500;"
  },
  {
    id: 'q4',
    title: '4. 模糊查询 (LIKE)',
    category: 'Pattern Matching',
    description: '查询擅长 "Yoga" (瑜伽) 的教练。',
    sql: "SELECT TrainerName, Specialty FROM Trainers WHERE Specialty LIKE '%Yoga%';"
  },
  {
    id: 'q5',
    title: '5. 排序查询 (ORDER BY)',
    category: 'Sorting',
    description: '按课时费从高到低列出所有教练。',
    sql: "SELECT TrainerName, HourlyRate FROM Trainers ORDER BY HourlyRate DESC;"
  },
  {
    id: 'q6',
    title: '6. 聚合函数 (AVG/COUNT)',
    category: 'Aggregation',
    description: '计算所有教练的平均课时费。',
    sql: "SELECT AVG(HourlyRate) AS AverageRate FROM Trainers;"
  },
  {
    id: 'q7',
    title: '7. 多表连接 (INNER JOIN)',
    category: 'Joins',
    description: '查询每门课程的名称及其授课教练的名字。',
    sql: "SELECT C.CourseName, T.TrainerName \nFROM Courses C \nINNER JOIN Trainers T ON C.TrainerID = T.TrainerID;"
  },
  {
    id: 'q8',
    title: '8. 分组统计 (GROUP BY)',
    category: 'Grouping',
    description: '统计每个难度级别的课程数量。',
    sql: "SELECT Difficulty, COUNT(*) AS CourseCount \nFROM Courses \nGROUP BY Difficulty;"
  },
  {
    id: 'q9',
    title: '9. 子查询 (Subquery)',
    category: 'Advanced',
    description: '查询课时费高于平均水平的教练。',
    sql: "SELECT TrainerName, HourlyRate \nFROM Trainers \nWHERE HourlyRate > (SELECT AVG(HourlyRate) FROM Trainers);"
  },
  {
    id: 'q10',
    title: '10. 外连接 (LEFT JOIN)',
    category: 'Joins',
    description: '列出所有教练及其负责的课程（包括没有课程的教练）。',
    sql: "SELECT T.TrainerName, C.CourseName \nFROM Trainers T \nLEFT JOIN Courses C ON T.TrainerID = C.TrainerID;"
  }
];

export const VIEW_DEFINITIONS = [
  {
    id: 'v1',
    title: '视图 1: V_MemberEnrollments',
    description: '展示会员详细选课信息的视图，包含会员名、课程名和教练名。',
    sql: `CREATE VIEW V_MemberEnrollments AS
SELECT 
    m.FullName AS MemberName,
    c.CourseName,
    t.TrainerName,
    e.EnrollDate
FROM Enrollments e
JOIN Members m ON e.MemberID = m.MemberID
JOIN Courses c ON e.CourseID = c.CourseID
JOIN Trainers t ON c.TrainerID = t.TrainerID;`
  },
  {
    id: 'v2',
    title: '视图 2: V_CourseAvailability',
    description: '展示课程及其当前的报名人数统计。',
    sql: `CREATE VIEW V_CourseAvailability AS
SELECT 
    c.CourseID,
    c.CourseName,
    c.MaxCapacity,
    COUNT(e.EnrollID) AS CurrentEnrollment,
    (c.MaxCapacity - COUNT(e.EnrollID)) AS SpotsRemaining
FROM Courses c
LEFT JOIN Enrollments e ON c.CourseID = e.CourseID
GROUP BY c.CourseID, c.CourseName, c.MaxCapacity;`
  }
];
