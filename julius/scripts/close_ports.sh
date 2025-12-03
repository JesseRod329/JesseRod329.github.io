#!/bin/bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: close_ports.sh [port ...] [--force]

Without ports, all LISTEN-ing TCP sockets owned by the current user are targeted.
Provide one or more port numbers to limit which ones are closed.
Pass --force to skip the confirmation prompt.
USAGE
}

PORTS=()
FORCE=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --help|-h)
      usage
      exit 0
      ;;
    --force|-f)
      FORCE=true
      shift
      ;;
    --)
      shift
      break
      ;;
    -*)
      echo "Unknown flag: $1" >&2
      usage >&2
      exit 1
      ;;
    *)
      if [[ $1 =~ ^[0-9]+$ ]]; then
        PORTS+=("$1")
        shift
      else
        echo "Invalid port: $1" >&2
        exit 1
      fi
      ;;
  esac
done

PORT_FILTERS=()
if [[ ${#PORTS[@]} -gt 0 ]]; then
  for port in "${PORTS[@]}"; do
    PORT_FILTERS+=("-iTCP:${port}")
  done
else
  PORT_FILTERS=(-iTCP)
fi

PID_OUTPUT=$(lsof -tiTCP -sTCP:LISTEN -n -P -u "$USER" "${PORT_FILTERS[@]}" || true)
if [[ -z ${PID_OUTPUT:-} ]]; then
  echo "No matching listening sockets found." >&2
  exit 0
fi
PIDS=($PID_OUTPUT)

echo "The following processes will be terminated:" >&2
lsof -iTCP -sTCP:LISTEN -n -P -u "$USER" "${PORT_FILTERS[@]}"

if [[ $FORCE == false ]]; then
  read -r -p "Proceed with kill? [y/N] " reply
  case "$reply" in
    [Yy]*) ;;
    *)
      echo "Aborted." >&2
      exit 1
      ;;
  esac
fi

kill "${PIDS[@]}" 2>/dev/null || true
sleep 1

# Check for survivors and SIGKILL if needed
REMAINING_OUTPUT=$(lsof -tiTCP -sTCP:LISTEN -n -P -u "$USER" "${PORT_FILTERS[@]}" || true)
if [[ -n ${REMAINING_OUTPUT:-} ]]; then
  echo "Processes still listening, sending SIGKILL..." >&2
  REMAINING=($REMAINING_OUTPUT)
  kill -9 "${REMAINING[@]}" 2>/dev/null || true
fi

echo "Done."
