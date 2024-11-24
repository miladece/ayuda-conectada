import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const SearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    const searchPublications = async () => {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('publications')
          .select('*')
          .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
          .limit(10);

        if (error) throw error;
        
        console.log("Search results:", data);
        setSearchResults(data || []);
      } catch (error) {
        console.error("Error searching publications:", error);
      }
    };

    const debounceTimeout = setTimeout(searchPublications, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const handleSearchResultClick = (result: any) => {
    const route = `/${result.type}s`;
    setSearchQuery("");
    setSearchResults([]);
    navigate(route, { state: { highlightId: result.id } });
  };

  return (
    <div className="relative mb-8">
      <div className="flex items-center w-full max-w-3xl mx-auto">
        <Input
          type="text"
          placeholder="Buscar publicaciones..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10 w-full"
        />
        <Search className="absolute right-3 h-5 w-5 text-gray-400" />
      </div>
      {searchResults.length > 0 && searchQuery && (
        <div className="absolute z-10 w-full max-w-3xl mx-auto mt-2 bg-white rounded-md shadow-lg border">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
              onClick={() => handleSearchResultClick(result)}
            >
              <h3 className="font-medium">{result.title}</h3>
              <p className="text-sm text-gray-600 truncate">{result.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};