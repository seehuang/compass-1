export interface Limitation {
    cpu: string;
    memory: string;
}

export interface Resource {
    limits: Limitation;
    requests: Limitation;
}

export interface Base {
    name: string,
    image: string,
    imagePullPolicy: string,
    resource: Resource
}

export interface Environment {
    type: string
    oneEnvConfig: any
}

export interface Pattern {
    type: string;
    httpPort: string;
    url: string;
    tcpPort: string;
    command: string;
}

export interface Probe {
    status: boolean;
    timeout: string;
    cycle: string
    retryCount: string;
    delay: string;
    pattern?: Pattern;
}

export interface LifeCycle {
    status: boolean
    postStart: Pattern
    preStop: Pattern
}


export interface Container {
    base: Base,
    commands: string[],
    args: string[],
    environment: Environment[],
    readyProbe: Probe,
    liveProbe: Probe,
    lifeCycle: LifeCycle
}


export const base: Base = {
    name: "default",
    image: "app:latest",
    imagePullPolicy: "IfNotPresent",
    resource: {
        limits: {
            cpu: "0.3",
            memory: "170",
        },
        requests: {
            cpu: "0.1",
            memory: "30"
        }
    }
};
export const commands: string[] = [];

export const args: string[] = [];

export const environment: Environment[] = [];

export const readyProbe: Probe = {
    status: false,
    timeout: "",
    cycle: "",
    retryCount: "",
    delay: "",
    pattern: {
        type: "HTTP",
        httpPort: "8081",
        url: "",
        tcpPort: "0",
        command: "",
    }
};
export const liveProbe: Probe = {
    status: false,
    timeout: "",
    cycle: "",
    retryCount: "",
    delay: "",
    pattern: {
        type: "HTTP",
        httpPort: "8082",
        url: "",
        tcpPort: "0",
        command: "",
    }
};
export const lifeCycle: LifeCycle = {
    status: false,
    postStart: {
        type: "HTTP",
        httpPort: "8080",
        url: "",
        tcpPort: "0",
        command: "",
    },
    preStop: {
        type: "HTTP",
        httpPort: "8080",
        url: "",
        tcpPort: "0",
        command: "",
    }
};

export const container: Container = {
    base: base,
    commands: commands,
    args: args,
    environment: environment,
    readyProbe: readyProbe,
    liveProbe: liveProbe,
    lifeCycle: lifeCycle
}