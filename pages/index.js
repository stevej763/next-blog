import Container from "../components/pageComponents/container";
import About from "../components/about/about";
import PostPreviewGrid from "../components/pageComponents/post-preview-grid";
import Intro from "../components/pageComponents/intro";
import Layout from "../components/pageComponents/layout";
import { getAllPosts } from "../lib/api";
import Head from "next/head";
import SectionSeparator from "../components/section-separator";

export default function Home({ allPosts }) {
  const latestPosts = allPosts.slice(0, 2);
  return (
    <>
      <Layout>
        <Head>
          <title>Steve Jones: Home</title>
        </Head>
        <Container>
          <Intro />
          <About />
          <SectionSeparator />
          {<PostPreviewGrid posts={latestPosts} />}
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
    "coverImage",
    "excerpt",
    "category",
  ]);

  return {
    props: { allPosts },
  };
}
