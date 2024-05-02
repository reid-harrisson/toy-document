import { Layout } from "pages/layout";
import {
  Container,
  Header,
  Body,
  Titles,
  Editor,
  Footer,
  TitleItm,
  BackBtn,
  Frame,
  Board,
  Control,
  EditBtn,
  Split,
  BoardNo,
  BoardTitle,
  BoardBody,
  BoardLink,
  BoardSpace,
  BoardFrame,
} from "./styles";
import { useEffect, useState } from "react";
import { SuggestModal } from "../../components";
import { MultiInput } from "components/multi_input";

export interface Docs {
  id: number;
  title: string;
  body: string;
  url: string;
  labels: string[];
}

export const Documents = () => {
  const [docs, setDocs] = useState<Docs[]>([]);
  const [labels, setLabels] = useState<string[][]>([]);
  const [id, setId] = useState(0);
  const [modal, showModal] = useState(false);

  useEffect(() => {
    const fetchJson = async () => {
      const response = await fetch(process.env.PUBLIC_URL + "mock.json");
      if (!response.ok) {
        throw new Error("Failed to retrieve file");
      }
      const datas = await response.json();
      let temp: Docs[] = datas;
      temp.forEach((doc) => {
        doc.labels = [];
      });
      setDocs(temp);
    };

    fetchJson();
  }, []);

  useEffect(() => {
    if (labels.length === 0) {
      const temp = docs.map((doc) => []);
      setLabels(temp);
    }
  }, [docs, labels.length]);

  const onGoPrev = () => {
    if (id > 1) setId(id - 1);
  };

  const onGoNext = () => {
    if (id < docs.length) setId(id + 1);
  };

  const onSave = () => {
    if (id > 0 && labels.length > 0) {
      sessionStorage.setItem(`${id}`, JSON.stringify(labels[id - 1]));
      onGoNext();
    }
  };

  const onReset = () => {
    if (id > 0 && labels.length > 0) {
      const text = sessionStorage.getItem(`${id}`) || "";
      try {
        const temp = JSON.parse(text) as string[];
        if (temp !== undefined) {
          let temps = labels.map((arr) => [...arr]);
          temps[id - 1] = temp;
          setLabels(temps);
        }
      } catch {}
    }
  };

  return (
    <Layout page="documents">
      {modal && (
        <SuggestModal
          onHide={() => showModal(false)}
          id={id}
          setLabels={setLabels}
          labels={labels}
        />
      )}
      <Container>
        <Header />
        <Body>
          <Titles $selected={id > 0}>
            {docs.map((data) => {
              return (
                <TitleItm
                  key={data.id}
                  disabled={data.id + 1 === id}
                  onClick={() => setId(data.id + 1)}
                >
                  <div id="id">{data.id + 1}</div>
                  {id === 0 && <div id="title">{data.title}</div>}
                </TitleItm>
              );
            })}
          </Titles>
          <Editor $selected={id > 0}>
            <BackBtn onClick={() => setId(0)}>{">"}</BackBtn>
            <Frame>
              <Board>
                <BoardFrame>
                  <BoardNo>{`${id}/${docs.length} documents`}</BoardNo>
                  <BoardTitle>
                    {(id > 0 && docs[id - 1].title) || ""}
                  </BoardTitle>
                  <BoardBody>{(id > 0 && docs[id - 1].body) || ""}</BoardBody>
                  <BoardSpace>
                    <BoardLink
                      href={(id > 0 && docs[id - 1].url) || ""}
                      target="#blank"
                    >
                      Go to Acticle...
                    </BoardLink>
                  </BoardSpace>
                  {id > 0 && id <= labels.length && (
                    <MultiInput
                      labels={labels[id - 1]}
                      setLabels={(arr) => {
                        const temp = labels.map((label) => [...label]);
                        temp[id - 1] = arr;
                        setLabels(temp);
                      }}
                    />
                  )}
                </BoardFrame>
              </Board>
              <Control>
                <EditBtn onClick={() => setId(1)}>First</EditBtn>
                <EditBtn onClick={onGoPrev}>Prev</EditBtn>
                <EditBtn onClick={onGoNext}>Next</EditBtn>
                <EditBtn onClick={() => setId(docs.length)}>Last</EditBtn>
                <Split />
                <EditBtn onClick={onSave}>Save</EditBtn>
                <EditBtn onClick={onReset}>Reset</EditBtn>
                <EditBtn onClick={() => showModal(true)}>Suggest Label</EditBtn>
              </Control>
            </Frame>
          </Editor>
        </Body>
        <Footer />
      </Container>
    </Layout>
  );
};