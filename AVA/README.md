# AVA - MCP Filesystem Server Setup

This project includes the Model Context Protocol (MCP) filesystem server for secure file operations.

## Installation

The package is already installed via npm:

```bash
npm install
```

## Configuration

The MCP filesystem server allows AI assistants to perform file operations within specified directories. 

### Example Configuration

See `mcp-config.example.json` for an example configuration. This needs to be added to your MCP client configuration (e.g., Cursor, Claude Desktop).

The server restricts all operations to the directories you specify in the configuration. In the example, operations are limited to the AVA directory.

### Usage

You can run the server directly using npx:

```bash
npx @modelcontextprotocol/server-filesystem /path/to/allowed/directory
```

Or configure it in your MCP client settings using the example configuration file.

## Security

- All file operations are restricted to the specified allowed directories
- The server validates all paths to prevent directory traversal attacks
- Only explicitly allowed directories can be accessed

## Features

- Read and write files (UTF-8 encoding)
- Create, list, and delete directories
- Move files and directories
- Search for files recursively
- Get file and directory metadata
- Advanced file editing with pattern matching


