interface SearchName {
  firstName: string;
  lastName: string;
}

export function searchName(name: string | undefined): SearchName | undefined {
  let firstName: string;
  let lastName: string;
  if (name) {
    const splits = name.split(" ");
    firstName = splits[0].trim();
    lastName = splits.map((_, i) => {
      return splits[i + 1];
    }).join(" ").trim();
    return {
      firstName: firstName,
      lastName: lastName,
    };
  } else {
    return undefined;
  }
}
