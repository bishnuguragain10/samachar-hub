CREATE TABLE `articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`titleNe` text,
	`slug` varchar(255) NOT NULL,
	`excerpt` text,
	`excerptNe` text,
	`content` text NOT NULL,
	`contentNe` text,
	`aiSummary` text,
	`aiSummaryNe` text,
	`coverImage` text,
	`coverImageKey` text,
	`categoryId` int,
	`authorId` int,
	`status` enum('draft','published','scheduled') NOT NULL DEFAULT 'draft',
	`isBreaking` boolean NOT NULL DEFAULT false,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`isSponsored` boolean NOT NULL DEFAULT false,
	`youtubeUrl` text,
	`tags` text,
	`metaTitle` text,
	`metaDescription` text,
	`viewCount` int NOT NULL DEFAULT 0,
	`scheduledAt` timestamp,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articles_id` PRIMARY KEY(`id`),
	CONSTRAINT `articles_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `bookmarks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`articleId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bookmarks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`nameNe` varchar(100),
	`slug` varchar(100) NOT NULL,
	`description` text,
	`descriptionNe` text,
	`color` varchar(20) DEFAULT '#dc2626',
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`articleId` int NOT NULL,
	`userId` int,
	`guestName` varchar(100),
	`guestEmail` varchar(320),
	`content` text NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `newsletter_subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(100),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `newsletter_subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_subscribers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` text;--> statement-breakpoint
ALTER TABLE `articles` ADD CONSTRAINT `articles_categoryId_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `articles` ADD CONSTRAINT `articles_authorId_users_id_fk` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookmarks` ADD CONSTRAINT `bookmarks_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookmarks` ADD CONSTRAINT `bookmarks_articleId_articles_id_fk` FOREIGN KEY (`articleId`) REFERENCES `articles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_articleId_articles_id_fk` FOREIGN KEY (`articleId`) REFERENCES `articles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;