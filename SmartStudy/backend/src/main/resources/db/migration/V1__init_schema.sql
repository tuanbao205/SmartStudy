-- ===== ROLES =====
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO roles (name) VALUES ('STUDENT'), ('ADMIN');

-- ===== USERS =====
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id BIGINT NOT NULL REFERENCES roles(id),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- ===== COURSES =====
CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    credits INT,
    lecturer_name VARCHAR(255),
    semester VARCHAR(50),
    academic_year VARCHAR(20),
    color VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- ===== STUDENT_COURSES (bảng trung gian) =====
CREATE TABLE student_courses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (user_id, course_id)
);

-- ===== SCHEDULES =====
CREATE TABLE schedules (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    day_of_week SMALLINT NOT NULL, -- 1=Monday ... 7=Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- ===== ASSIGNMENTS =====
CREATE TABLE assignments (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deadline TIMESTAMP NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH
    status VARCHAR(20) NOT NULL DEFAULT 'TODO',      -- TODO, IN_PROGRESS, COMPLETED, OVERDUE
    estimated_hours NUMERIC(5,2),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- ===== GRADE_COMPONENTS (thành phần điểm linh hoạt) =====
CREATE TABLE grade_components (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- vd: 'Chuyên cần', 'Giữa kỳ', 'Cuối kỳ'
    weight NUMERIC(5,2) NOT NULL -- vd: 10.00 nghĩa là 10%
);

-- ===== GRADES =====
CREATE TABLE grades (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    grade_component_id BIGINT NOT NULL REFERENCES grade_components(id) ON DELETE CASCADE,
    score NUMERIC(5,2),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (user_id, grade_component_id)
);