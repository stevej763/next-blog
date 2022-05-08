import Layout from "../../components/pageComponents/layout";
import Head from "next/head";
import Container from "../../components/pageComponents/container";
import Intro from "../../components/pageComponents/intro";
import Contact from "../../components/contact/contact";

export default function ContactMe() {
  return (
    <>
      <Layout>
        <Head>
          <title>Steve Jones: Blog</title>
        </Head>
        <Container>
          <Intro />
          <Contact />
        </Container>
      </Layout>
    </>
  );
}
