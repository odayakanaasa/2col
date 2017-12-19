import Link from "gatsby-link"
import * as React from 'react'

import {CompareSegment, Links, Segment, TwoColArticle} from "../TwoColArticle";

type ToCompare = { left: string, right: string, leftLang?: string, rightLang?: string }
//      style={{overflowWrap: "break-word"}}

const Compare: React.StatelessComponent<ToCompare> = ({left, right, leftLang, rightLang}: ToCompare) => {
  return <div className="flex border-b-2 bg-grey">
    <div
      className="w-1/2 relative"
    >

      <span
        className="absolute pin-l pin-t bg-teal-dark rounded-full px-2"
      >
        {leftLang}
        </span>
      <div className="pt-6 pb-3 bg-grey"
           dangerouslySetInnerHTML={{__html: left}}
      ></div>

    </div>
    <div className="w-1/2 relative bg-grey">
      <span
        className="absolute pin-l pin-t bg-teal-dark rounded-full px-2"
      >{rightLang}</span>
      <div className="pt-6 pb-3 bg-grey"
           dangerouslySetInnerHTML={{__html: right}}></div>
    </div>
  </div>
}


// language=Markdown
const md2ColArticle = `# test\nlearn js by python  or learn python by js
# 输出 hello world
\`\`\`JavaScript
console.log('hello world')
\`\`\`

\`\`\`Python
print( 'hello world')
\`\`\`

现在大家学会两个语言的 hello world 了吧


# 定义数组

\`\`\`JavaScript
const  array = []

\`\`\`


\`\`\`python
array = []
\`\`\`


# 遍历数组

\`\`\`JavaScript
// ES6
for(let item of array){
	console.log(item)
}
\`\`\`

\`\`\`Python

for item in array:
	print(item)
\`\`\`

`

console.log(`${__filename}:84 \n`, md2ColArticle);

function isCodeToCompare(object: Segment): object is CompareSegment {
  return object.type === 'compare'
}


const SegmentContainer = ({segment, links}: { segment: Segment, links: Links }) => {
  if (isCodeToCompare(segment)) {
    const [left, right] = segment.tokens

    return <Compare
      left={TwoColArticle.renderTokenToRawHtml(left, links)}
      leftLang={left.lang}

      right={TwoColArticle.renderTokenToRawHtml(right, links)}
      rightLang={right.lang}
    />
  } else {
    return <div dangerouslySetInnerHTML={{__html: TwoColArticle.renderTokensToRawHtml(segment.tokens, links)}}></div>
  }
}


const Article = ({md}: { md: string }) => {

  const tca = new TwoColArticle(md)

  console.log(`${__filename}:114 Article`, tca.segments);

  return <div className="post">
    {tca.segments.slice(0, 1).map((seg, i) => <SegmentContainer
      segment={seg}
      links={tca.links}
      key={i}/>)}
  </div>
}


export default () =>
  <div className="site">
    <Link to="/about">
      About
    </Link>
    <h1>开始对比</h1>

    <Article md={md2ColArticle}/>

  </div>
