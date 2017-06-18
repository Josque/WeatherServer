# WeatherServer

This project uses [vagrant](https://www.vagrantup.com). 
To get up and running, install vagrant and  [VirtualBox](https://www.virtualbox.org/).

Make sure the Vagrant binary is in your PATH. On *nix OSes the installer will take care of it, I'm not so sure about Windows. 

Then, navigate to the project folder in your terminal, and type
`vagrant up` followed by `vagrant provision`. Then: `vagrant ssh`, and finally `/vagrant/bin/www`. 

The project has port forwarding to localhost. 
Simply fire up your browser and go to `localhost:8080`, or `https://localhost:8443`. 
Be careful though, the SSL warning bites!

The default username is `admin`, the default password is (you guessd it) `admin`.