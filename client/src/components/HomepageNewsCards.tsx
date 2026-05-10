import NewsCard from "./NewsCard";

// Static dummy data for homepage
const dummyArticles = [
  {
    id: 1,
    thumbnail:
      "https://images.unsplash.com/photo-1495070516877-d8b1f0bb6b77b04d0f762d397337d.jpg?w=800&h=450&fit=crop",
    category: "Politics",
    categoryNe: "राजनीति",
    title: "Major Political Development Announced",
    description:
      "Government announces new political reforms aimed at strengthening democratic institutions and ensuring transparency in governance.",
    publishedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    thumbnail:
      "https://images.unsplash.com/photo-1451183918865-b41f2eb1b9873c2d482ca8461f33d.jpg?w=800&h=450&fit=crop",
    category: "Business",
    categoryNe: "व्यापार",
    title: "Economic Growth Exceeds Expectations",
    description:
      "Latest economic reports show significant growth in Q4 with GDP expanding by 3.2% compared to previous quarter.",
    publishedAt: "2024-01-14T14:20:00Z",
  },
  {
    id: 3,
    thumbnail:
      "https://images.unsplash.com/photo-1518770660479-0db09d96f23c67d6539e4d.jpg?w=800&h=450&fit=crop",
    category: "Technology",
    categoryNe: "प्रविध्य",
    title: "Breakthrough in Quantum Computing",
    description:
      "Scientists achieve major breakthrough in quantum computing with stable qubits maintained for record time.",
    publishedAt: "2024-01-13T09:15:00Z",
  },
  {
    id: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1496752268352-4e57ec45e8a8be382e5e.jpg?w=800&h=450&fit=crop",
    category: "Sports",
    categoryNe: "खेलाडु",
    title: "National Team Wins Championship",
    description:
      "National football team secures victory in championship final with decisive performance against defending champions.",
    publishedAt: "2024-01-12T18:45:00Z",
  },
  {
    id: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1494535162867-9d10e07b14f42a8e8a9d7a1b.jpg?w=800&h=450&fit=crop",
    category: "Entertainment",
    categoryNe: "मनोरञ्जन",
    title: "Film Festival Celebrates Cultural Heritage",
    description:
      "Annual film festival showcases traditional arts and cultural performances with record attendance from visitors worldwide.",
    publishedAt: "2024-01-11T16:30:00Z",
  },
  {
    id: 6,
    thumbnail:
      "https://images.unsplash.com/photo-15263772429-9d946b071e7d6ae7e1d.jpg?w=800&h=450&fit=crop",
    category: "International",
    categoryNe: "अन्तराष्ट्रिय",
    title: "Global Climate Summit Reaches Agreement",
    description:
      "World leaders agree on ambitious climate action plan to reduce carbon emissions by 45% over the next decade.",
    publishedAt: "2024-01-10T12:00:00Z",
  },
];

export default function HomepageNewsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dummyArticles.map(article => (
        <NewsCard
          key={article.id}
          thumbnail={article.thumbnail}
          category={article.category}
          categoryNe={article.categoryNe}
          title={article.title}
          description={article.description}
          publishedAt={article.publishedAt}
          variant="default"
        />
      ))}
    </div>
  );
}
