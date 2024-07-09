import { Command } from "commander";
import tunnelmole from "../tunnelmole.js";
import { Options } from "../options.js";
import isNumber from 'is-number';
import { setApiKey } from "../identity/api-key-service.js";
import { unreserveDomain } from "../domains/unreseve-domain.js";

/**
 * Build Options from the command line input, then pass them off to tunnelmole()
 */
export default function makeDispatchCommand(command: Command) {
  return async (arg0 : any, arg1: string, domain: string) => {
    const options : Options = {};

    // If the first argument is a number, launch Tunnelmole and expose the port
    if (isNumber(arg0)) {
        options.port = parseInt(arg0);
    }
    options.connectAddress = process.env['TUNNELMOLE_CONNECT_ADDRESS']

    if (typeof arg1 === 'string' && arg1.toLowerCase() === 'as' && typeof domain === 'string') {
        options.domain = domain;
    } else if (typeof arg1 === 'string' && arg1 === "AS" && typeof domain !== 'string') {
        console.info("Please enter the domain you want to expose e.g. foo.tunnelmole.net");
    } 

    // Check for a route handler for any options passed
    const routeOption = resolveRoute(command);
    if (typeof routeOption === 'string') {
        const handler = routes[routeOption];
        // Call the handler, command[routeOption] is the value of the command line option then exit
        await handler(command[routeOption]);
        return Promise.resolve();
    }

    if (options.port) {
        // We have enough to Launch Tunnelmole
        tunnelmole(options);
        return;
    }

    // No actions to dispatch based on arguments. Show help.
    command.help();
  }
}

// See if any command line options match a route to handle them. Return the name of the handler for the first match
const resolveRoute = (command: Command): string|undefined => {
    for (const option in command) {
        if (routes[option] !== undefined) {
            return option;
        }
    }

    return undefined;
}

const routes = {
    "setApiKey": setApiKey,
    "unreserveSubdomain": unreserveDomain
}
