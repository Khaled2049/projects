import { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { useParams } from "react-router-dom";
import { Chapter, storiesRepo } from "../../components/StoriesRepo";

const StoryDetail = () => {
  const [story, setStory] = useState<any>(null);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    const fetchStory = async () => {
      if (id) {
        try {
          await loadStory(id);
        } catch (error) {
          console.error("Error fetching story:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchStory();
  }, []);

  const loadStory = async (storyId: string) => {
    try {
      const story = await storiesRepo.getStory(storyId);
      const storyChapters = await storiesRepo.getChapters(storyId);
      setChapters(storyChapters);
      setStory(story);
    } catch (error) {
      console.error("Error fetching story:", error);
    }
  };

  const renderContent = (content: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const elements = Array.from(doc.body.childNodes);

    return elements.map((el, index) => {
      if (el.nodeName === "P") {
        return <p key={index}>{el.textContent}</p>;
      } else if (el.nodeName === "IMG") {
        const src = (el as HTMLImageElement).src;
        return (
          <div key={index} className="flex justify-center mb-4">
            <img src={src} alt="" className="max-w-full h-auto" />
          </div>
        );
      } else if (el.nodeName === "UL") {
        const listItems = Array.from(el.childNodes).map((li, liIndex) => (
          <li key={liIndex} className="ml-6 list-disc">
            {(li as HTMLElement).textContent}
          </li>
        ));
        return (
          <ul key={index} className="mb-4">
            {listItems}
          </ul>
        );
      } else {
        return null;
      }
    });
  };

  return (
    story && (
      <>
        {loading ? (
          <Loader className="m-auto" size="2rem" />
        ) : (
          <div className="max-w-[90%] md:max-w-[75%] lg:max-w-[65%] mx-auto p-4 md:p-8 rounded-lg mt-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-center text-amber-900">
              {story.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-1 md:mb-2 text-center">
              By {story.author}
            </p>
            <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6 text-center">
              Last updated: {new Date(story.updatedAt).toLocaleDateString()}
            </p>
            <div className="prose prose-lg max-w-none bg-white p-4 md:p-6 rounded-md leading-relaxed shadow-md">
              {chapters.map((chapter: Chapter) => (
                <div key={chapter.id} className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-amber-900">
                    {chapter.title}
                  </h2>
                  <div className="text-base md:text-lg text-gray-800">
                    {renderContent(chapter.content)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    )
  );
};

export default StoryDetail;
