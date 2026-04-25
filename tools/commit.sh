#!/usr/bin/env zsh

C_RESET='\033[0m'
C_FEAT='\033[38;5;114m'
C_FIX='\033[38;5;210m'
C_DOCS='\033[38;5;111m'
C_STYLE='\033[38;5;177m'
C_REFACTOR='\033[38;5;179m'
C_TEST='\033[38;5;117m'
C_CHORE='\033[38;5;245m'
C_TITLE='\033[38;5;252m'

select_commit_type() {
  clear >&2
  echo >&2
  echo -e "${C_TITLE}[menu] select commit type:${C_RESET}" >&2
  echo -e "${C_FEAT}1. feat     -> new feature${C_RESET}" >&2
  echo -e "${C_FIX}2. fix      -> bug fix${C_RESET}" >&2
  echo -e "${C_DOCS}3. docs     -> documentation changes${C_RESET}" >&2
  echo -e "${C_STYLE}4. style    -> code style changes${C_RESET}" >&2
  echo -e "${C_REFACTOR}5. refactor -> code refactoring${C_RESET}" >&2
  echo -e "${C_TEST}6. test     -> add or update tests${C_RESET}" >&2
  echo -e "${C_CHORE}7. chore    -> other changes${C_RESET}" >&2

  read -r "?enter your choice (1-7): " typeChoice

  case "$typeChoice" in
    1) echo "feat" ;;
    2) echo "fix" ;;
    3) echo "docs" ;;
    4) echo "style" ;;
    5) echo "refactor" ;;
    6) echo "test" ;;
    7) echo "chore" ;;
    *) echo "chore" ;;
  esac
}

get_commit_message() {
  echo >&2
  read -r "?enter commit message: " msg
  [[ -z "${msg// }" ]] && get_commit_message || echo "$msg"
}

do_commit() {
  commitType=$(select_commit_type)
  msg=$(get_commit_message)
  commitText="${commitType}: ${msg}"

  echo >&2
  echo -e "${C_TITLE}[info] committing with message:${C_RESET}" >&2
  echo -e "${C_FEAT}${commitText}${C_RESET}" >&2

  git add .
  git commit -m "$commitText"
  git pull origin main
  git push origin main

  [[ $? -eq 0 ]] \
    && echo -e "${C_FEAT}[success] commit completed!${C_RESET}" \
   || echo -e "${C_FIX}[error] commit failed!${C_RESET}"
}

do_commit
