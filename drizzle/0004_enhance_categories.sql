-- Enhanced categories migration with production-grade features
-- Adds visibility controls, featured toggle, parent category support, and icon management

-- Add new columns to categories table
ALTER TABLE categories 
ADD COLUMN iconUrl VARCHAR(500),
ADD COLUMN iconKey VARCHAR(500),
ADD COLUMN parentId INT,
ADD COLUMN isVisibleInNav BOOLEAN DEFAULT TRUE NOT NULL,
ADD COLUMN isFeatured BOOLEAN DEFAULT FALSE NOT NULL,
ADD COLUMN isActive BOOLEAN DEFAULT TRUE NOT NULL,
ADD COLUMN updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Create default categories if they don't exist
INSERT IGNORE INTO categories (id, name, nameNe, slug, description, descriptionNe, color, sortOrder, isVisibleInNav, isFeatured, isActive) VALUES
(1, 'Politics', 'राजनीति', 'politics', 'Political news and updates from Nepal and around the world', 'नेपाल र विश्वभरका राजनीतिक समाचारहरू र अपडेटहरू', '#dc2626', 1, TRUE, TRUE, TRUE),
(2, 'Business', 'व्यापार', 'business', 'Business news, market updates, and economic analysis', 'व्यापार समाचार, बजार अपडेट, र आर्थिक विश्लेषण', '#059669', 2, TRUE, TRUE, TRUE),
(3, 'Technology', 'प्रविधि', 'technology', 'Latest technology news, gadgets, and digital trends', 'नवीनतम प्रविधि समाचार, ग्याजेटहरू, र डिजिटल प्रवृत्तिहरू', '#2563eb', 3, TRUE, TRUE, TRUE),
(4, 'Sports', 'खेलकुद', 'sports', 'Sports news, match results, and athlete updates', 'खेलकुद समाचार, म्याच परिणाम, र खेलाडी अपडेटहरू', '#ea580c', 4, TRUE, TRUE, TRUE),
(5, 'Entertainment', 'मनोरञ्जन', 'entertainment', 'Entertainment news, movies, music, and celebrity updates', 'मनोरञ्जन समाचार, चलचित्र, संगीत, र सेलिब्रिटी अपडेटहरू', '#7c3aed', 5, TRUE, TRUE, TRUE),
(6, 'International', 'अन्तर्राष्ट्रिय', 'international', 'International news and global affairs', 'अन्तर्राष्ट्रिय समाचार र विश्व मामिलाहरू', '#0891b2', 6, TRUE, TRUE, TRUE),
(7, 'More', 'थप', 'more', 'More news categories and special features', 'थप समाचार श्रेणीहरू र विशेष सुविधाहरू', '#6b7280', 7, TRUE, FALSE, TRUE);

-- Add foreign key constraint for parent category (self-reference)
ALTER TABLE categories ADD CONSTRAINT fk_category_parent 
FOREIGN KEY (parentId) REFERENCES categories(id) ON DELETE SET NULL;

-- Add index for better performance on common queries
CREATE INDEX idx_categories_nav_order ON categories(isVisibleInNav, sortOrder, isActive);
CREATE INDEX idx_categories_featured ON categories(isFeatured, sortOrder);
CREATE INDEX idx_categories_parent ON categories(parentId);
CREATE INDEX idx_categories_slug_active ON categories(slug, isActive);
