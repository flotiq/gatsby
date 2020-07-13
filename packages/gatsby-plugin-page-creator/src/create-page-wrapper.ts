import { Actions, CreatePagesArgs } from "gatsby"
import { createPath, validatePath, ignorePath } from "gatsby-page-utils"
import { createClientOnlyPage } from "./create-client-only-page"
import { createPagesFromCollectionBuilder } from "./create-pages-from-collection-builder"
import systemPath from "path"
import fs from "fs-extra"

function pathIsCollectionBuilder(path: string): boolean {
  if (fs.existsSync(path) === false) return false
  const js = fs.readFileSync(path).toString()
  return js.includes(`unstable_createPagesFromData`)
}

function pathIsClientOnlyRoute(path: string): boolean {
  return path.includes(`[`)
}

export function createPage(
  filePath: string,
  pagesDirectory: string,
  actions: Actions,
  ignore: string[],
  graphql: CreatePagesArgs["graphql"]
): void {
  // Filter out special components that shouldn't be made into
  // pages.
  if (!validatePath(filePath)) {
    return
  }

  // Filter out anything matching the given ignore patterns and options
  if (ignorePath(filePath, ignore)) {
    return
  }

  const absolutePath = systemPath.join(pagesDirectory, filePath)

  // If the page has a function call to unstable_createPagesFromData markers in it, then we create it as a collection builder
  if (pathIsCollectionBuilder(absolutePath)) {
    if (!process.env.GATSBY_NEW_ROUTING_APIS) {
      console.error(
        `PageCreator: Found a collection route, but the proper env was not set to enable this experimental feature. Please run again with \`GATSBY_NEW_ROUTING_APIS=1\` to enable.`
      )
      console.log(`Skipping creating pages for ${absolutePath}`)
      return
    }
    createPagesFromCollectionBuilder(filePath, absolutePath, actions, graphql)
    return
  }

  // If the path includes a `[]` in it, then we create it as a client only route
  if (pathIsClientOnlyRoute(absolutePath)) {
    if (!process.env.GATSBY_NEW_ROUTING_APIS) {
      console.error(`PageCreator: Found a client route, but the proper env was not set to enable this experimental feature. Please run again with \`GATSBY_NEW_ROUTING_APIS=1\` to enable.
             Skipping creating pages for ${absolutePath}
        `)
      return
    }
    createClientOnlyPage(filePath, absolutePath, actions)
    return
  }

  // Create page object
  const createdPath = createPath(filePath)
  const page = {
    path: createdPath,
    component: absolutePath,
    context: {},
  }

  // Add page
  actions.createPage(page)
}