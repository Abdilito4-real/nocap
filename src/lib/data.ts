import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string): ImagePlaceholder | undefined => PlaceHolderImages.find(img => img.id === id);

export const videoPosts = [
  {
    id: 1,
    user: {
      name: 'Sarah Day',
      avatarUrl: getImage('profile_picture_1')?.imageUrl,
      avatarHint: getImage('profile_picture_1')?.imageHint,
    },
    videoUrl: getImage('video_thumbnail_1')?.imageUrl,
    videoHint: getImage('video_thumbnail_1')?.imageHint,
    caption: 'Enjoying the sunny day on campus! ☀️ #universitylife #studytok',
    likes: 1204,
    comments: 89,
    shares: 42,
  },
  {
    id: 2,
    user: {
      name: 'Mike Ross',
      avatarUrl: getImage('profile_picture_2')?.imageUrl,
      avatarHint: getImage('profile_picture_2')?.imageHint,
    },
    videoUrl: getImage('video_thumbnail_2')?.imageUrl,
    videoHint: getImage('video_thumbnail_2')?.imageHint,
    caption: 'Late night study session for finals. Wish me luck! 📚',
    likes: 3012,
    comments: 230,
    shares: 112,
  },
  {
    id: 3,
    user: {
      name: 'Jessica P.',
      avatarUrl: getImage('profile_picture_3')?.imageUrl,
      avatarHint: getImage('profile_picture_3')?.imageHint,
    },
    videoUrl: getImage('video_thumbnail_3')?.imageUrl,
    videoHint: getImage('video_thumbnail_3')?.imageHint,
    caption: 'Found the coziest spot in the library today.',
    likes: 987,
    comments: 55,
    shares: 23,
  },
];

export const assignments = [
  { id: 1, courseCode: 'CS101', title: 'Data Structures Essay', dueDate: '2024-10-25', completed: false },
  { id: 2, courseCode: 'ENG203', title: 'Shakespeare Analysis', dueDate: '2024-10-28', completed: false },
  { id: 3, courseCode: 'PHY301', title: 'Quantum Mechanics Problem Set', dueDate: '2024-11-02', completed: true },
  { id: 4, courseCode: 'ART100', title: 'Renaissance Art History Presentation', dueDate: '2024-11-05', completed: false },
];

export const jobs = [
  {
    id: 1,
    title: 'Part-Time Barista',
    company: 'Campus Coffee',
    location: 'On-Campus',
    description: 'Looking for an energetic individual to join our team. Flexible hours available.',
  },
  {
    id: 2,
    title: 'Web Dev Intern',
    company: 'TechStart Inc.',
    location: 'Remote',
    description: 'Assist in developing and maintaining our new student-focused web application. React experience preferred.',
  },
  {
    id: 3,
    title: 'Library Assistant',
    company: 'University Library',
    location: 'On-Campus',
    description: 'Help students find resources, manage book shelving, and assist with library events.',
  },
  {
    id: 4,
    title: 'Marketing Gig',
    company: 'Local Eats',
    location: 'City Center',
    description: 'Promote our new app on campus. Earn commission for every new user you sign up.',
  },
];

export const confessions = [
  {
    id: 1,
    content: "I accidentally called my professor 'mom' today. I don't think I can ever show my face in that class again.",
    upvotes: 543,
    downvotes: 12,
    comments: 45,
    image: null,
  },
  {
    id: 2,
    content: "To the person who returned my lost wallet, thank you! You're a hero. I wish I could thank you in person.",
    upvotes: 1200,
    downvotes: 5,
    comments: 88,
    image: getImage('confession_image_1')?.imageUrl,
    imageHint: getImage('confession_image_1')?.imageHint,
  },
  {
    id: 3,
    content: "I'm a final year student and I still don't know what I want to do with my life. Is anyone else feeling this pressure?",
    upvotes: 987,
    downvotes: 8,
    comments: 152,
    image: null,
  },
];

export const userProfile = {
  name: 'Alex Doe',
  university: 'State University',
  course: 'Computer Science',
  year: 3,
  bio: 'Just trying to survive my CS degree. Fueled by coffee and code. ☕💻',
  avatarUrl: getImage('profile_picture_1')?.imageUrl,
  avatarHint: getImage('profile_picture_1')?.imageHint,
  videos: [
    { id: 'v1', thumbnailUrl: getImage('user_video_thumb_1')?.imageUrl, imageHint: getImage('user_video_thumb_1')?.imageHint, views: '1.2k' },
    { id: 'v2', thumbnailUrl: getImage('user_video_thumb_2')?.imageUrl, imageHint: getImage('user_video_thumb_2')?.imageHint, views: '3.4k' },
    { id: 'v3', thumbnailUrl: getImage('user_video_thumb_3')?.imageUrl, imageHint: getImage('user_video_thumb_3')?.imageHint, views: '5.6k' },
  ],
  savedJobs: [jobs[1], jobs[3]],
  assignments: assignments.slice(0, 2),
};
