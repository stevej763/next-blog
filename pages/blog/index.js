import { getAllPosts } from "../../lib/api";
import Layout from "../../components/pageComponents/layout";
import Head from "next/head";
import Container from "../../components/pageComponents/container";
import Intro from "../../components/pageComponents/intro";
import HeroPost from "../../components/post/hero-post";
import PostPreviewGrid from "../../components/pageComponents/post-preview-grid";

export default function Blog({ allPosts }) {
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);
  return (
    <>
      <Layout>
        <Head>
          <title>Steve Jones: Blog</title>
        </Head>
        <Container>
          <Intro />
          {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.coverImage}
              date={heroPost.date}
              author={heroPost.author}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
              category={heroPost.category}
            />
          )}
          {morePosts.length > 0 && (
            <PostPreviewGrid posts={morePosts} heading="More Articles" />
          )}
        </Container>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "category",
    "coverImage",
    "excerpt",
  ]);

  return {
    props: { allPosts },
  };
}
