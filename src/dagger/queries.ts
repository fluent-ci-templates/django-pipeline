import { gql } from "../../deps.ts";

export const djangoTests = gql`
  query djangoTests($src: String!) {
    djangoTests(src: $src)
  }
`;
