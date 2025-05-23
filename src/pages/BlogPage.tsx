import React, { useEffect, useState, Component, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { getPosts, type NotionPost } from '@/lib/notion';
import { BlogCard } from '@/components/blog/BlogCard';
import { Pagination } from '@/components/blog/Pagination';
import { ShimmerText } from '@/components/ui/shimmer-text';
import { Loader2, AlertCircle } from 'lucide-react';

const POSTS_PER_PAGE = 9;

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error in BlogPage:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-red-400">Something went wrong</h3>
          <p className="text-white/60 max-w-md">
            An error occurred while rendering the blog posts. Please try again later.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const BlogPage = () => {
  const [posts, setPosts] = useState<NotionPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setPosts([]); // Clear existing posts while loading
      setError(null);
      try {
        console.log('Fetching blog posts...');
        const { posts: newPosts, totalPages: total } = await getPosts(currentPage, POSTS_PER_PAGE);
        console.log(`Fetched ${newPosts.length} posts for page ${currentPage}`);
        setPosts(newPosts);
        setTotalPages(total);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <ShimmerText className="text-4xl md:text-5xl font-semibold mb-6">
            Latest Insights & Updates
          </ShimmerText>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Discover strategies, tips, and success stories to help you grow your business
            and connect with high-value clients.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-red-400">{error}</h3>
            <p className="text-white/60 max-w-md">
              Please check your internet connection and try again later.
            </p>
          </div>
        ) : (
          <ErrorBoundary>
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {posts.map((post) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full"
                  >
                    <BlogCard post={post} />
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <h3 className="text-xl font-semibold mb-4 text-white">No Blog Posts Found</h3>
                <p className="text-white/60 max-w-md">
                  Check back soon for new content and updates.
                </p>
              </div>
            )}

            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </motion.div>
            )}
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
