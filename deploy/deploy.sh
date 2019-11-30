if [ ! -d "personal-site-frontend/dist" ]; then
    echo "Cannot deploy project because it has not been built to the 'dist' folder yet. Please build the project first."
    exit 1
fi

current_branch=$(git branch | grep \* | cut -d ' ' -f2)

if [ "$current_branch" == "release" ]; then
    domain=$(cat deploy/surge-assets/prod/CNAME)
else
    domain=$(cat deploy/surge-assets/dev/CNAME)
fi

echo "Deploying to $domain"
surge --project ./personal-site-frontend/dist --domain "$domain"
