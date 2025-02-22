PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. &> /dev/null && pwd )"
echo "PROJECT_ROOT: $PROJECT_ROOT"

cd $PROJECT_ROOT
mkdir -p build
cmake --build $(realpath $PROJECT_ROOT/build) --config Release --target all 