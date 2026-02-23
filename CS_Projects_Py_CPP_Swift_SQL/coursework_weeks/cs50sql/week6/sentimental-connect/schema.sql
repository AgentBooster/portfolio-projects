CREATE TABLE `users` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `first_name` VARCHAR(64) NOT NULL,
    `last_name` VARCHAR(64) NOT NULL,
    `username` VARCHAR(64) NOT NULL UNIQUE,
    `password` VARCHAR(128) NOT NULL
);

CREATE TABLE `schools` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(128) NOT NULL,
    `type` VARCHAR(32) NOT NULL CHECK (`type` IN ('Primary', 'Secondary', 'Higher Education')),
    `location` VARCHAR(128) NOT NULL,
    `founded_year` YEAR NOT NULL
);

CREATE TABLE `companies` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(128) NOT NULL,
    `industry` VARCHAR(32) NOT NULL CHECK (`industry` IN ('Technology', 'Education', 'Business')),
    `location` VARCHAR(128) NOT NULL
);

CREATE TABLE `connections` (
    `user_id` INT UNSIGNED NOT NULL,
    `connection_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`user_id`, `connection_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`connection_id`) REFERENCES `users`(`id`),
    CHECK (`user_id` < `connection_id`)
);

CREATE TABLE `user_schools` (
    `user_id` INT UNSIGNED NOT NULL,
    `school_id` INT UNSIGNED NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE,
    `degree` VARCHAR(64) NOT NULL,
    PRIMARY KEY (`user_id`, `school_id`, `start_date`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`)
);

CREATE TABLE `user_companies` (
    `user_id` INT UNSIGNED NOT NULL,
    `company_id` INT UNSIGNED NOT NULL,
    `title` VARCHAR(128) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE,
    PRIMARY KEY (`user_id`, `company_id`, `start_date`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`)
);
