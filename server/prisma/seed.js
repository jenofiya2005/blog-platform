const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.postLike.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash('password123', 10);

  const userSarah = await prisma.user.create({
    data: {
      email: 'sarah@example.com',
      username: 'sarahj',
      name: 'Sarah Jenkins',
      password: passwordHash,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      bio: 'Staff Frontend Engineer & Design Systems enthusiast. Writing about React, Tailwind, and Web Performance.',
      role: 'ADMIN'
    }
  });

  const userAlex = await prisma.user.create({
    data: {
      email: 'alex@example.com',
      username: 'alexr',
      name: 'Alex Rivera',
      password: passwordHash,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      bio: 'Product Designer & UX Researcher. Exploring intuitive user interfaces and human-centered design principles.',
      role: 'USER'
    }
  });

  const userDavid = await prisma.user.create({
    data: {
      email: 'david@example.com',
      username: 'davidc',
      name: 'David Chen',
      password: passwordHash,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      bio: 'Cloud Architect & AI Engineer. Passionate about scalable backend systems, serverless, and LLMs.',
      role: 'USER'
    }
  });

  const userDemo = await prisma.user.create({
    data: {
      email: 'demo@blog.com',
      username: 'demouser',
      name: 'Demo Explorer',
      password: passwordHash,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      bio: 'Full-stack explorer experimenting with new tech stacks and writing insightful developer notes.',
      role: 'USER'
    }
  });

  console.log('✅ Created 4 sample users');

  const catTech = await prisma.category.create({
    data: {
      name: 'Web Development',
      slug: 'web-development',
      description: 'Modern frontend, backend, frameworks, and web architecture tutorials and insights.'
    }
  });

  const catAI = await prisma.category.create({
    data: {
      name: 'Artificial Intelligence',
      slug: 'artificial-intelligence',
      description: 'Exploring machine learning, agentic workflows, LLMs, and prompt engineering.'
    }
  });

  const catDesign = await prisma.category.create({
    data: {
      name: 'UI/UX Design',
      slug: 'ui-ux-design',
      description: 'Design systems, accessibility, typography, and crafting delightful digital products.'
    }
  });

  const catDevOps = await prisma.category.create({
    data: {
      name: 'Cloud & DevOps',
      slug: 'cloud-devops',
      description: 'CI/CD, Docker, Kubernetes, microservices, and high-availability infrastructure.'
    }
  });

  const catCareer = await prisma.category.create({
    data: {
      name: 'Career & Growth',
      slug: 'career-growth',
      description: 'Navigating software engineering careers, leadership, productivity, and tech lifestyle.'
    }
  });

  console.log('✅ Created 5 categories');

  const post1 = await prisma.post.create({
    data: {
      title: 'Building Scalable Full-Stack Web Applications in 2026',
      slug: 'building-scalable-full-stack-web-applications-2026',
      excerpt: 'A comprehensive deep dive into modern architectural paradigms, component hierarchies, and database optimization strategies.',
      content: `## The Modern Full-Stack Blueprint

Building web applications in 2026 requires balancing developer agility with uncompromising runtime performance and reliability. In this article, we break down the fundamental pillars of modern web software architecture.

### 1. Decoupled & Modular Architecture
Clean separation of concerns between client rendering layers and robust API interfaces enables agile iterations. Whether adopting micro-frontends or clean monolithic services, boundaries must remain explicit.

\`\`\`javascript
// Example: Clean API controller pattern
const getArticles = async (req, res) => {
  const { category, page = 1 } = req.query;
  const articles = await articleService.fetchPaginated({ category, page });
  res.json({ success: true, data: articles });
};
\`\`\`

### 2. Pragmatic State Management
Rather than over-engineering client global stores, modern applications favor server-state synchronization with optimistic updates and local UI state.

### 3. Key Takeaways
- **Type safety end-to-end** prevents an entire class of runtime errors.
- **Relational models with lightweight ORMs** provide superior query flexibility and consistency.
- **Micro-interactions and responsive feedback** elevate good software to great software.`,
      coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      readTime: 4,
      published: true,
      tags: 'react,javascript,architecture,fullstack',
      views: 342,
      authorId: userSarah.id,
      categoryId: catTech.id
    }
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'The Rise of Autonomous AI Agents: What Developers Need to Know',
      slug: 'rise-of-autonomous-ai-agents-what-developers-need-to-know',
      excerpt: 'How multi-agent systems, tool calling, and long-term memory are transforming modern software development pipelines.',
      content: `## Beyond Simple Chatbots

The AI landscape has shifted decisively from conversational completions toward **autonomous agentic workflows**. Agents are now capable of executing multi-step plans, writing and debugging code, running automated tests, and verifying runtime outputs.

### The Anatomy of an Agentic Loop
1. **Perception**: Ingesting user prompt, contextual codebase files, and environment metadata.
2. **Reasoning & Planning**: Formulating an iterative execution roadmap.
3. **Tool Invocation**: Calling shell commands, search engines, and file operations.
4. **Self-Correction**: Analyzing compiler warnings and test failures to adjust on the fly.

> "The future belongs to developers who orchestrate specialized AI swarms to solve complex domain problems."

### Recommended Tooling
- Structured tool schema definitions
- Deterministic sandbox environments
- Human-in-the-loop review checkpoints for critical production changes.`,
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
      readTime: 5,
      published: true,
      tags: 'ai,llm,agents,future-tech',
      views: 520,
      authorId: userDavid.id,
      categoryId: catAI.id
    }
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'Mastering Modern UI/UX: Micro-Interactions and Visual Polish',
      slug: 'mastering-modern-ui-ux-micro-interactions-and-visual-polish',
      excerpt: 'Small design details that create delightful user experiences, from tactile hover states to subtle physics-based motion.',
      content: `## The Art of the Micro-Interaction

In digital product design, the difference between an average interface and a captivating product lies in **micro-interactions**.

### Why Small Details Matter
When a user clicks a button, submits a comment, or toggles dark mode, instantaneous visual feedback establishes user confidence and trust.

### Essential Rules for UI Polish
- **Subtle Elevation**: Use multi-layered soft shadows instead of harsh black borders.
- **Smooth State Transitions**: Apply CSS transitions to buttons and cards.
- **Clear Information Hierarchy**: Bold titles, muted subtitles, and purposeful color accents guide user attention effortlessly.`,
      coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      readTime: 3,
      published: true,
      tags: 'design,tailwind,ux,frontend',
      views: 289,
      authorId: userAlex.id,
      categoryId: catDesign.id
    }
  });

  const post4 = await prisma.post.create({
    data: {
      title: 'Demystifying Zero-Downtime Deployments & Container Orchestration',
      slug: 'demystifying-zero-downtime-deployments-container-orchestration',
      excerpt: 'A practical guide to rolling updates, health checks, and Docker container strategies for continuous deployment.',
      content: `## Deploying with Complete Confidence

Nothing builds reliability like having confidence that your new release won't interrupt ongoing active user sessions.

### Core Deployment Strategies
- **Rolling Deployments**: Gradually replacing old pods with new versions after passing readiness probes.
- **Blue-Green Deployments**: Maintaining two identical production environments and instantly switching traffic at the load balancer.
- **Database Schema Migrations**: Always execute backwards-compatible additive migrations before deploying application code that references new columns!`,
      coverImage: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80',
      readTime: 6,
      published: true,
      tags: 'devops,docker,cloud,infrastructure',
      views: 198,
      authorId: userDavid.id,
      categoryId: catDevOps.id
    }
  });

  const post5 = await prisma.post.create({
    data: {
      title: 'From Junior to Staff: Accelerating Your Software Engineering Career',
      slug: 'from-junior-to-staff-accelerating-software-engineering-career',
      excerpt: 'Key habits, communication skills, technical leverage, and mindset shifts that accelerate developer career progression.',
      content: `## The Non-Linear Growth Path

Writing clean code is only the entry ticket. True engineering leadership is about multiplying the effectiveness of your team and aligning technical solutions with business value.

### Key Milestones
1. **Junior to Mid-Level**: Mastering fundamentals, shipping features reliably, writing comprehensive tests.
2. **Mid-Level to Senior**: Designing scalable systems, anticipating edge cases, mentoring peers, and driving technical decisions.
3. **Senior to Staff**: Defining architecture across multiple teams, unlocking organizational productivity, and resolving high-ambiguity technical challenges.`,
      coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      readTime: 4,
      published: true,
      tags: 'career,productivity,leadership,mentorship',
      views: 415,
      authorId: userSarah.id,
      categoryId: catCareer.id
    }
  });

  console.log('✅ Created 5 sample blog posts');

  await prisma.comment.create({
    data: {
      content: 'Fantastic breakdown! The section on decoupled architecture and server state resonated strongly with my current project.',
      authorId: userAlex.id,
      postId: post1.id
    }
  });

  await prisma.comment.create({
    data: {
      content: 'Very clear explanation. Do you recommend Prisma or raw SQL query builders for high-throughput write workloads?',
      authorId: userDemo.id,
      postId: post1.id
    }
  });

  await prisma.comment.create({
    data: {
      content: 'Multi-agent loops are definitely the most exciting direction in AI. The tool invocation and verification cycle makes all the difference!',
      authorId: userSarah.id,
      postId: post2.id
    }
  });

  await prisma.comment.create({
    data: {
      content: 'Love the tips on subtle elevation and transition timing! Applying this to our design system immediately.',
      authorId: userDemo.id,
      postId: post3.id
    }
  });

  console.log('✅ Created sample comments');

  await prisma.postLike.create({ data: { userId: userAlex.id, postId: post1.id } });
  await prisma.postLike.create({ data: { userId: userDavid.id, postId: post1.id } });
  await prisma.postLike.create({ data: { userId: userDemo.id, postId: post1.id } });
  await prisma.postLike.create({ data: { userId: userSarah.id, postId: post2.id } });
  await prisma.postLike.create({ data: { userId: userDemo.id, postId: post2.id } });
  await prisma.postLike.create({ data: { userId: userSarah.id, postId: post3.id } });

  console.log('✅ Created sample likes');
  console.log('🎉 Seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
