#!/bin/bash

C_RESET='\033[0m'
C_PRIMARY='\033[38;5;111m'
C_ACCENT='\033[38;5;114m'
C_WARN='\033[38;5;210m'
C_TITLE='\033[38;5;252m'

run() {
  docker compose up
}

run_clean() {
  BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  PROJECT_NAME="$(basename "$BASE_DIR" | tr '[:upper:]' '[:lower:]')"

  docker compose down -v
  docker volume rm ${PROJECT_NAME}_mysql_data ${PROJECT_NAME}_maven_cache 2>/dev/null
  docker compose up
}

commit() {
  ./tools/commit.sh
}

main() {
  clear

  BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  cd "$BASE_DIR" || exit 1

  echo -e "[MENU]"
  echo -e "${C_PRIMARY}1 run${C_RESET}"
  echo -e "${C_ACCENT}2 run clean${C_RESET}"
  echo -e "${C_PRIMARY}3 commit${C_RESET}"
  echo -e "${C_WARN}0 exit${C_RESET}"
  echo
  read -rp "option: " opt

  case "$opt" in
    1) run ;;
    2) run_clean ;;
    3) commit ;;
    0) exit 0 ;;
    *) echo -e "${C_WARN}invalid${C_RESET}" ;;
  esac
}

main
