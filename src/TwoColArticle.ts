import {Token, Tokens, TokensList} from "marked";
import * as Marked from "marked";


type CodeToCompare = [Tokens.Code, Tokens.Code]

export type Segment = CodeToCompare | Token

const NullSegment = {
  type: 'null'
}

export type Links = {
  [key: string]: { href: string; title: string; }
}

function toSegments(md: string): {
  segments: Segment[], links: {
    [key: string]: { href: string; title: string; }
  }
} {

  const tokenList: TokensList = Marked.lexer(md)
  const links = tokenList.links

  const tokens: Token[] = tokenList
  const ss: Segment[] = []

  let lastSegment = tokens[0]


  for (let i = 1; i < tokens.length - 1;) {
    const token = tokens[i]

    if (token.type === 'code' && lastSegment.type === 'code') {
      ss.push([lastSegment, token])
      lastSegment = NullSegment as Token
      i++
    } else {
      ss.push(lastSegment)
      lastSegment = token
      i++
    }
  }


  return {segments: ss, links}
}


export class TwoColArticle {

  private mySegments: Segment[] = []
  private myLinks: Links;

  constructor(md: string) {
    const tokensList: TokensList = Marked.lexer(md)
    this.myLinks = tokensList.links
    this.mySegments = this.mergeSegment(tokensList)
  }

  private mergeSegment(tokens: Token[]) {

    const ss: Segment[] = []

    const nTokens = tokens.length
    let i = 0
    while (i < nTokens) {

      const currentToken = tokens[i]
      const nextToken = tokens[i + 1]

      if (nextToken && nextToken.type === "code" && currentToken.type === 'code') {

        ss.push([currentToken, nextToken])
        i += 2
      } else {
        ss.push(currentToken)
        i += 1
      }
    }
    return ss
  }

  get segments(): Segment[] {
    return this.mySegments
  }

  get links() {
    return this.myLinks
  }

  static renderTokenToRawHtml(tokens: Token, links: Links): string {
    const toRender: TokensList = [tokens] as TokensList
    toRender.links = links

    return Marked.parser(toRender)
  }
}

