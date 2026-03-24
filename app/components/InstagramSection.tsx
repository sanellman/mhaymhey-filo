'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface IGPost {
  shortcode: string;
  display_url: string;
  thumbnail_src: string;
  is_video: boolean;
  edge_media_to_caption: { edges: { node: { text: string } }[] };
  pinned_for_users: { id: string }[];
}

export default function InstagramSection() {
  const [posts, setPosts] = useState<IGPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/instagram')
      .then((r) => r.json())
      .then((data) => {
        const edges: { node: IGPost }[] =
          data?.data?.user?.edge_owner_to_timeline_media?.edges ?? [];
        const filtered = edges
          .map((e) => e.node)
          .filter((n) => (!n.pinned_for_users || n.pinned_for_users.length === 0) && !n.is_video)
          .slice(0, 6);
        setPosts(filtered);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="w-full flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[#72C4E8] text-xs font-bold tracking-widest">📷 INSTAGRAM</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {loading && (
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <p className="text-center text-white/30 text-sm">ไม่สามารถโหลดรูปได้</p>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {posts.map((post, i) => (
              <motion.a
                key={post.shortcode}
                href={`https://www.instagram.com/p/${post.shortcode}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square rounded-xl overflow-hidden group border border-white/10"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/instagram/image?url=${encodeURIComponent(post.thumbnail_src || post.display_url)}`}
                  alt={post.edge_media_to_caption.edges[0]?.node.text?.slice(0, 60) || 'mhaymhey'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white text-2xl transition-opacity duration-300">🔍</span>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        <div className="text-center mt-5">
          <a
            href="https://www.instagram.com/mhaymhey.stellagrima/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#72C4E8] text-sm font-semibold hover:underline transition"
          >
            <span>ดูทั้งหมดบน Instagram</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
