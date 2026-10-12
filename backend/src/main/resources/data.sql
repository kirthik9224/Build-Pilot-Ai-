-- Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
-- Description: Initial seed data for BuildPilot AI Pro

INSERT IGNORE INTO users (id, name, email, password_hash, role) VALUES
(1, 'Kirthik', 'demo@buildpilot.dev', '$2a$10$tJ9fF781Xn9G1.vJ7v.h0u0i8McbN8r1eA5gD1c1V0j5l0J6WlQ7K', 'LEAD');

INSERT IGNORE INTO projects (id, name, description, owner_id) VALUES
(1, 'ShopEase E-commerce Store', 'Modern e-commerce platform built with React and Spring Boot', 1);

INSERT IGNORE INTO issues (id, project_id, title, category, severity, file_name, root_cause, impact) VALUES
(1, 1, 'SQL built by string concatenation', 'Security', 'CRITICAL', 'OrderRepository.java', 'User input is appended directly into the query text.', 'Attackers can read or delete any order data.'),
(2, 1, 'Checkout button has 2.1:1 contrast', 'Accessibility', 'HIGH', 'style.css', 'Light grey text on a pale blue background.', 'Fails WCAG AA; low-vision shoppers cannot read the label.'),
(3, 1, 'Product images missing alt text', 'Accessibility', 'MEDIUM', 'index.html', 'Images rendered without alt attributes.', 'Screen readers announce file names instead of products.'),
(4, 1, 'Product grid overflows on 360px screens', 'Responsive', 'HIGH', 'style.css', 'Fixed 4-column grid with no breakpoint.', 'Horizontal scrolling on phones hurts mobile conversion.'),
(5, 1, 'Uneven padding on hero and cards', 'UI/UX', 'LOW', 'style.css', 'Mixed 14px, 18px and 22px spacing values.', 'Layout feels inconsistent and unpolished.'),
(6, 1, 'Unawaited fetch in cart script', 'Code Quality', 'MEDIUM', 'script.js', 'Promise returned by fetch is never awaited or caught.', 'Cart silently fails on network errors.'),
(7, 1, 'JWT secret hard-coded in source', 'Security', 'CRITICAL', 'application.properties', 'Signing secret committed to the repository.', 'Anyone with repo access can forge login tokens.'),
(8, 1, 'Navbar links lack keyboard focus style', 'UI/UX', 'LOW', 'style.css', 'outline is set to none with no replacement.', 'Keyboard users cannot see where they are.');

INSERT IGNORE INTO help_articles (id, topic, question, answer) VALUES
(1, 'Getting started', 'How do I sign in?', 'Use demo@buildpilot.dev with the password demo123. Your session ends when you press Log out or close the tab.'),
(2, 'Getting started', 'What should I do first?', 'Open the Dashboard to see your project health, then go to Error Detection and repair the critical and high issues first.'),
(3, 'Issues', 'What does Repair issue do?', 'It marks the issue as resolved in the database. The Dashboard health score updates straight away because it reads the same data.'),
(4, 'Issues', 'How is the health score calculated?', 'It starts at 100. Each open issue removes points: critical 15, high 8, medium 4, low 1.'),
(5, 'Deadline Mode', 'How is delivery risk decided?', 'We assume each feature takes about 3 person-days and compare that with days multiplied by team size. Above 1.0 the risk is high, above 0.7 it is medium.'),
(6, 'Settings', 'Where are my preferences saved?', 'Settings are saved to the database when you press Save settings, so they are still there next time you sign in.'),
(7, 'Settings', 'What does monitoring sensitivity change?', 'A higher value reports smaller problems, such as a 2px spacing difference. A lower value reports only clear failures.'),
(8, 'Account', 'How do I log out?', 'Press Log out in the top right corner. Your session token is removed on the server.');

REPLACE INTO settings (setting_key, setting_value) VALUES
('sensitivity', '3'), ('alertLevel', 'HIGH'), ('ruleWcag', 'true'), ('ruleSecurity', 'true'),
('ruleResponsive', 'true'), ('ruleStyle', 'false'), ('aiModel', 'balanced'),
('tabSize', '2'), ('autoFix', 'false'), ('emailDigest', 'true'), ('apiToken', 'bp_live_demo_token_123');
