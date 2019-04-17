cat src/list.json | jq '.[] | .urlname' | tr -d '"' | xargs -n 1 -I{} echo "node -r esm download.js {} > gdg-events/{}.json" > fetch.sh
