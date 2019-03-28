$ cat src/list.json | jq '.[] | .urlname' | tr -d '"' | xargs -n 1 -I{} echo "http https://api.meetup.com/{}/events status==past > events/{}.json"
