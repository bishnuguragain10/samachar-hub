ALTER TABLE `articles` DROP INDEX `articles_slug_unique`;--> statement-breakpoint
ALTER TABLE `categories` DROP INDEX `categories_slug_unique`;--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` DROP INDEX `newsletter_subscribers_email_unique`;--> statement-breakpoint
ALTER TABLE `articles` DROP FOREIGN KEY `articles_categoryId_categories_id_fk`;
--> statement-breakpoint
ALTER TABLE `articles` DROP FOREIGN KEY `articles_authorId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `bookmarks` DROP FOREIGN KEY `bookmarks_userId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `bookmarks` DROP FOREIGN KEY `bookmarks_articleId_articles_id_fk`;
--> statement-breakpoint
ALTER TABLE `comments` DROP FOREIGN KEY `comments_articleId_articles_id_fk`;
--> statement-breakpoint
ALTER TABLE `comments` DROP FOREIGN KEY `comments_userId_users_id_fk`;
