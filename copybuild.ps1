param (
  [string]$target
)

$target = $target + "\node_modules\zengenti-isomorphic-base"

npm run build:lib
Copy-Item -Path .\zengenti-isomorphic-base.js -Destination $target
Copy-Item -Path .\zengenti-isomorphic-base.js.map -Destination $target
Copy-Item -Path .\client.js -Destination $target
Copy-Item -Path .\client.js.map -Destination $target
Copy-Item -Path .\util.js -Destination $target
Copy-Item -Path .\util.js.map -Destination $target