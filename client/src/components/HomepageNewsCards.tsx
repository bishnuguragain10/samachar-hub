import NewsCard from "./NewsCard";

// Static dummy data for homepage
const dummyArticles = [
  {
    article: {
      id: 1,
      title: "Major Political Development Announced",
      slug: "major-political-development-announced",
      excerpt: "Government announces new political reforms aimed at strengthening democratic institutions and ensuring transparency in governance.",
      coverImage: "https://images.unsplash.com/photo-1495070516877-d8b1f0bb6b77b04d0f762d397337d.jpg?w=800&h=450&fit=crop",
      isBreaking: false,
      isFeatured: false,
      isSponsored: false,
      viewCount: 1234,
      publishedAt: new Date("2024-01-15T10:30:00Z"),
      createdAt: new Date("2024-01-15T10:30:00Z"),
    },
    category: {
      name: "Politics",
      nameNe: "राजनीति",
      slug: "politics",
      color: "#dc2626",
    },
  },
  {
    article: {
      id: 2,
      title: "Economic Growth Exceeds Expectations",
      slug: "economic-growth-exceeds-expectations",
      excerpt: "Latest economic reports show significant growth in Q4 with GDP expanding by 3.2% compared to previous quarter.",
      coverImage: "https://images.unsplash.com/photo-1451183918865-b41f2eb1b9873c2d482ca8461f33d.jpg?w=800&h=450&fit=crop",
      isBreaking: false,
      isFeatured: false,
      isSponsored: false,
      viewCount: 987,
      publishedAt: new Date("2024-01-14T14:20:00Z"),
      createdAt: new Date("2024-01-14T14:20:00Z"),
    },
    category: {
      name: "Business",
      nameNe: "व्यापार",
      slug: "business",
      color: "#2563eb",
    },
  },
  {
    article: {
      id: 3,
      title: "Breakthrough in Quantum Computing",
      slug: "breakthrough-in-quantum-computing",
      excerpt: "Scientists achieve major breakthrough in quantum computing with stable qubits maintained for record time.",
      coverImage: "https://images.unsplash.com/photo-1518770660479-0db09d96f23c67d6539e4d.jpg?w=800&h=450&fit=crop",
      isBreaking: false,
      isFeatured: false,
      isSponsored: false,
      viewCount: 2156,
      publishedAt: new Date("2024-01-13T09:15:00Z"),
      createdAt: new Date("2024-01-13T09:15:00Z"),
    },
    category: {
      name: "Technology",
      nameNe: "प्रविधि",
      slug: "technology",
      color: "#7c3aed",
    },
  },
  {
    article: {
      id: 4,
      title: "National Team Wins Championship",
      slug: "national-team-wins-championship",
      excerpt: "National football team secures victory in championship final with decisive performance against defending champions.",
      coverImage: "https://images.unsplash.com/photo-1496752268352-4e57ec45e8a8be382e5e.jpg?w=800&h=450&fit=crop",
      isBreaking: false,
      isFeatured: false,
      isSponsored: false,
      viewCount: 3421,
      publishedAt: new Date("2024-01-12T18:45:00Z"),
      createdAt: new Date("2024-01-12T18:45:00Z"),
    },
    category: {
      name: "Sports",
      nameNe: "खेलकुद",
      slug: "sports",
      color: "#16a34a",
    },
  },
  {
    article: {
      id: 5,
      title: "Film Festival Celebrates Cultural Heritage",
      slug: "film-festival-celebrates-cultural-heritage",
      excerpt: "Annual film festival showcases traditional arts and cultural performances with record attendance from visitors worldwide.",
      coverImage: "https://images.unsplash.com/photo-1494535162867-9d10e07b14f42a8e8a9d7a1b.jpg?w=800&h=450&fit=crop",
      isBreaking: false,
      isFeatured: false,
      isSponsored: false,
      viewCount: 1876,
      publishedAt: new Date("2024-01-11T16:30:00Z"),
      createdAt: new Date("2024-01-11T16:30:00Z"),
    },
    category: {
      name: "Entertainment",
      nameNe: "मनोरञ्जन",
      slug: "entertainment",
      color: "#d97706",
    },
  },
  {
    article: {
      id: 6,
      title: "Global Climate Summit Reaches Agreement",
      slug: "global-climate-summit-reaches-agreement",
      excerpt: "World leaders agree on ambitious climate action plan to reduce carbon emissions by 45% over the next decade.",
      coverImage: "https://images.unsplash.com/photo-15263772429-9d946b071e7d6ae7e1d.jpg?w=800&h=450&fit=crop",
      isBreaking: false,
      isFeatured: false,
      isSponsored: false,
      viewCount: 2890,
      publishedAt: new Date("2024-01-10T12:00:00Z"),
      createdAt: new Date("2024-01-10T12:00:00Z"),
    },
    category: {
      name: "International",
      nameNe: "अन्तर्राष्ट्रिय",
      slug: "international",
      color: "#0891b2",
    },
  },
];

export default function HomepageNewsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dummyArticles.map(item => (
        <NewsCard
          key={item.article.id}
          data={item}
          variant="default"
          showExcerpt
        />
      ))}
    </div>
  );
}
